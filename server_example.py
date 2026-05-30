#!/usr/bin/env python3
"""
Minimal example server that receives volume-button events from the PulseFit
app and runs a Python action for each one.

Run:
    pip install flask
    python server_example.py

Then set the app's "Server URL" to:  http://<this-machine-ip>:8000/event
(use https in production — see note at bottom).
"""

from flask import Flask, request, jsonify

app = Flask(__name__)


def on_volume_up(payload):
    # TODO: put whatever you want to trigger here.
    print(f"[VOLUME UP]   from {payload.get('device')} at {payload.get('timestamp')}")


def on_volume_down(payload):
    # TODO: put whatever you want to trigger here.
    print(f"[VOLUME DOWN] from {payload.get('device')} at {payload.get('timestamp')}")


@app.route("/event", methods=["POST"])
def event():
    payload = request.get_json(silent=True) or {}
    button = payload.get("button")

    if button == "volume_up":
        on_volume_up(payload)
    elif button == "volume_down":
        on_volume_down(payload)
    else:
        return jsonify(ok=False, error="unknown button"), 400

    return jsonify(ok=True)


if __name__ == "__main__":
    # 0.0.0.0 so your phone on the same network can reach it.
    app.run(host="0.0.0.0", port=8000)

# Notes:
# - For real use, terminate TLS (https) in front of this (nginx/caddy) and add
#   an auth token check, since anything that can POST here can trigger actions.
# - Android blocks plain http:// by default; either use https, or add a network
#   security config exception for your server's host during local testing.
