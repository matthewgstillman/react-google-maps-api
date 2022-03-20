import React, { Component } from "react";
import GoogleMapReact from "google-map-react";

const AnyReactComponent = ({ text }) => <div>{text}</div>;
class SimpleMap extends Component {
  static defaultProps = {
    center: {
      lat: 40.772598,
      lng: -111.858429,
    },
    zoom: 16,
  };

  render() {
    return (
      // Important! Always set the container height explicitly
      <div style={{ height: "100vh", width: "100%" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY }}
          defaultCenter={this.props.center}
          defaultZoom={this.props.zoom}
        >
          <AnyReactComponent lat={40.772598} lng={-111.858429} />
        </GoogleMapReact>
      </div>
    );
  }
}

export default SimpleMap;
