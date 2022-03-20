import React, { useState, useRef, useCallback } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  useLoadScript,
  InfoWindow,
} from "@react-google-maps/api";
import mapStyles from "../mapStyles";
import { formatRelative } from "date-fns";
import { useForm } from "react-hook-form";
import Geocode from "react-geocode";

const containerStyle = {
  width: "100vw",
  height: "100vh",
};

const center = {
  lat: 40.772598,
  lng: -111.858429,
};

const options = {
  styles: mapStyles,
  //   disableDefaultUI: false,
  zoomControl: true,
  mapTypeId: "hybrid",
};

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [coords, setCoords] = useState({
    lat: 40.772598,
    lng: -111.858429,
  });
  const [address, setAddress] = useState("");
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ["places"],
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log(data.latitude, data.longitude);
    setCoords({ lat: data.latitude, lng: data.longitude });
    geocodeAddress({ lat: data.latitude, lng: data.longitude });
    setMarkers((current) => [
      ...current,
      {
        lat: data.latitude,
        lng: data.longitude,
        address: address,
        time: new Date(),
      },
    ]);
  };

  const mapRef = useRef();
  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const panTo = useCallback(({ lat, lng }) => {
    mapRef.current.panTo({ lat, lng });
    mapRef.current.setZoom(14);
    console.log(`Latitude: ${lat}\nLongitude: ${lng}`);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const geocodeAddress = (latLngCoords) => {
    Geocode.setApiKey(process.env.REACT_APP_GOOGLE_MAPS_API_KEY);
    Geocode.fromLatLng(latLngCoords.lat, latLngCoords.lng).then(
      (response) => {
        const address = response.results[0].formatted_address;
        console.log(address);
        setAddress(address);
        console.log(`Address is: ${address}`);
        console.log(`markers: ${markers}`);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  if (loadError) return "Error loading maps";
  if (!isLoaded) return "Loading Maps";
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* register your input into the hook by invoking the "register" function */}
        <input defaultValue="latitude" {...register("latitude")} />
        <input defaultValue="longitude" {...register("longitude")} />
        {/* include validation with required or other standard HTML validation rules */}
        {/* <input {...register("latitudeRequired", { required: true })} /> */}
        {/* errors will return when field validation fails  */}
        {/* {errors.latitudeRequired && <span>This field is required</span>} */}

        <input type="submit" />
        <h1>Address is: {address}</h1>
      </form>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={20}
        options={options}
        onClick={(event) => {
          setMarkers((current) => [
            ...current,
            {
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
              time: new Date(),
            },
          ]);
        }}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.time.toISOString()}
            position={{ lat: marker.lat, lng: marker.lng }}
            icon={{
              url: "http://maps.google.com/mapfiles/kml/paddle/ylw-blank.png",
              scaledSize: new window.google.maps.Size(30, 30),
              origin: new window.google.maps.Point(0, 0),
              anchor: new window.google.maps.Point(15, 15),
            }}
            onClick={() => {
              //   setAddress({ lat: selected.lat, lng: selected.lng });
              setSelected(marker);
            }}
          />
        ))}
        {selected ? (
          <InfoWindow
            position={{ lat: selected.lat, lng: selected.lng }}
            onCloseClick={() => {
              setSelected(null);
              //   setAddress({ lat: selected.lat, lng: selected.lng });
            }}
          >
            <div>
              <h2>Marker Created</h2>
              <h6>
                {selected.lat}, {selected.lng}{" "}
              </h6>
              <p>{formatRelative(selected.time, new Date())}</p>
            </div>
          </InfoWindow>
        ) : null}
        {/* Child components, such as markers, info windows, etc. */}

        <></>
      </GoogleMap>
    </div>
  );
};

export default MapComponent;
