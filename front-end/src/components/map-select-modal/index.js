import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import GoogleMapReact from 'google-map-react';

const MapSelectModal = (props) => {
  const [coords, setCoords] = useState({
    lat: null,
    lang: null,
  });
  const {
    onClose,
    visible,
    title,
    items,
  } = props;
  return (
    <Modal
      onCancel={onClose}
      visible={visible}
      title={title}
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={() => {
            props.onSubmit(coords);
          }}
        >
          تایید
        </Button>,
        <Button
          key="loc"
          type="primary"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition((position) => {
                props.onSubmit({
                  lat: position.coords.latitude,
                  lang: position.coords.longitude,
                });
              });
            }
          }}
        >
          مختصات من
        </Button>,
      ]}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        {items.map((item, index) => (
          <button
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            type="button"
            style={{
              width: 200, height: 200, border: 0, margin: '20px',
            }}
            onClick={() => setCoords(item.value)}
          >
            <h4>{item.label}</h4>
            <GoogleMapReact
              options={{ fullscreenControl: false, zoomControl: false }}
              bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
              defaultCenter={{
                lat: parseInt(item.value.lat, 10),
                lng: parseInt(item.value.long, 10),
              }}
              defaultZoom={11}
            >
              <div
                lat={parseInt(item.value.lat, 10)}
                lng={parseInt(item.value.long, 10)}
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  backgroundColor: 'red',
                }}
              />
            </GoogleMapReact>
          </button>
        ))}
      </div>
    </Modal>
  );
};

export default MapSelectModal;
