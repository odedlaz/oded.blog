title: Getting an Accurate Weather Forecast using Wi-Fi Position System
tags:
 - python
 - linux
categories:
 - devops
date: 2018-01-12 23:01:09
---

I'm travelling a lot with my laptop, and having an accurate weather forecast on-the-go is very convenient.

![](/images/2018/01/10_day_forecast.png)

I'm using [Fedora](https://getfedora.org) as my main (and only) OS, along with [i3wm](https://i3wm.org) and [polybar](https://github.com/jaagr/polybar). Previously I used [GNOME 3](https://www.gnome.org/gnome-3) which had a few weather widgets. The most feature-rich was [OpenWeather](https://extensions.gnome.org/extension/750/openweather), which worked pretty well.

[polybar](https://github.com/jaagr/polybar) doesn't have a native weather widget and the one's at [x70b1/polybar-scripts](https://github.com/x70b1/polybar-scripts) suffered from the same drawbacks that OpenWeather did: location had to be manually specified or was ip-geolocation based (which is not accurate enough)

How do I get an accurate location without a GPS? WiPS to the rescue!

## Wi-Fi Positioning System

Did you ever notice that you can get accurate location data when your GPS is turned off? The trick is to measure Wi-Fi signal intensity in order to triangulate your location.

Google, for instance, tracks open access points when you walk around and upload these along with your GPS location. When your GPS is turned off, they can use the access points around you to calculate your GPS coordinates. Cool right?

Lifewire [published an explanation about Wi-Fi triangulation](https://www.lifewire.com/wifi-positioning-system-1683343) a few months ago, and Wikipedia has a [nice article on the subject](https://en.wikipedia.org/wiki/Wi-Fi_positioning_system) as well.


## Getting Accurate Geolocation

Google Maps has a neat [Geolocation API](https://developers.google.com/maps/documentation/geolocation) that gives accurate location data if supplied with the MAC addresses of surrounding access points.


I can use [iw](https://linux.die.net/man/8/iw) to extract these by running:

```bash
$ iw <iface> scan | grep -io "[0-9A-F]\{2\}\(:[0-9A-F]\{2\}\)\{5\}" | uniq
```

But how the heck do I get the wireless interfaces? well, there's `/proc/net/wireless` for that -

```python
import re

def get_wireless_interfaces():
    iface_rx = re.compile('^(.*): ')

    # I love one-liners. Hope that doesn't look like perl :)
    # - open() returns a read-only file wrapper that is iterable
    # - map() executes re.match() on each line returned from open()
    # - 'yield from' is used to delegate the generator were creating to another generator
    yield from (m.group(1) for m
                in map(iface_rx.match, open('/proc/net/wireless'))
                if m)
```

Now, I need to to run `iw`. Running system commands from python is a pain in the ass.  
unless you use the mighty [sh](https://github.com/amoffat/sh) package, that is!

```python
import sh

def get_access_points_addresses():
    rx = re.compile('([0-9A-F]{2}(:[0-9A-F]{2}){5})', re.IGNORECASE)
    for iface in get_wireless_interfaces():
        matches = rx.findall(sh.iw(iface, "scan").stdout.decode('utf-8'))
        yield from (x[0].strip().lower() for x in matches)
```

And now all that's left is to kindly ask google to give us our location.  
`urllib` is a pain, so I'm using [requests](http://docs.python-requests.org) instead.

```python
import requests

def get_geolocation():
    # "considerIP" flags indicates if google should fallback to ip-based
    # geolocation if it can't find your ip using the given access points.
    data = {"considerIp": True,
            "wifiAccessPoints": [{"macAddress": hwaddr}
                                 for hwaddr in set(get_access_points())] }



    r = requests.post("https://www.googleapis.com/geolocation/v1/geolocate",
                      json=data,
                      params={"key": GOOGLE_MAPS_API_ACCESS_KEY })

    r.raise_for_status()

    location = r.json()["location"]
    return location["lng"], location["lat"]
```

## Getting Weather Forecast
[OpenWeather](https://extensions.gnome.org/extension/750/openweather/) widget used [OpenWeatherMap](http://openweathermap.org) API to get up-to-date weather forecast, so I used it as well.

```python
import requests
def get_weather_forecast(longitude, latitude):
    # I'm living in a country that uses a unit system that makes sense.
    params = {"units": "metric",
              "appid": OPEN_WEATHER_MAP_API_KEY,
              "lat": latitude, "lon": longitude}

    resp = requests.get("https://api.openweathermap.org/data/2.5/weather",
                        params=params)

    resp.raise_for_status()

    return resp.json()
```

And viola!

```python
longitude, latitude = get_geolocation()
forecast = get_weather_forecast(longitude, latitude)
print((f"{forecast['name']} "
       f"{forecast['main']['temp']:.0f}°C "
       f"[{forecast['weather'][0]['main']}]"))

# Tel-Aviv 18°C [Clear]
```
