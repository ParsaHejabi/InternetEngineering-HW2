import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Input, Select, Button } from 'antd';
import { Formik } from 'formik';
import { useParams } from 'react-router-dom';
import MapModal from '../../components/map-modal';
import MapSelectModal from '../../components/map-select-modal';

const InputGroup = Input.Group;

const { Option } = Select;

const initialValues = {};

const getAddress = (lat, long) => {
  const promise = new Promise((resolve, reject) => {
    fetch(`https://map.ir/reverse?lat=${lat}&lon=${long}`, {
      method: 'GET',
      headers: {
        'x-api-key': process.env.REACT_APP_MAP_IR_TOKEN
      }
    })
      .then((res) => res.json())
      .then((response) => {
        resolve(response.address_compact);
      })
      .catch((err) => {
        reject(err);
        console.log(err);
      });
  });
  return promise;
};

const FormScreen = () => {
  const { id } = useParams();
  const BACK_END_URL = useRef(`http://localhost:9000/api/forms/${id}`);

  const [showModal, setShowModal] = useState({});
  const [addresses, setAddresses] = useState({});
  const [formData, setFormData] = useState({ fields: [] });

  const getFormData = useCallback(async () => {
    const res = await fetch(BACK_END_URL.current);

    res.json().then((newRes) => {
      const newShowModal = {};
      const newAddresses = {};
      newRes.fields.forEach((field) => {
        if (field.type === 'Location') {
          initialValues[field.name] = { lat: Number, long: Number };
          newShowModal[field.name] = false;
          newAddresses[field.name] = 'آدرس را از نقشه انتخاب کنید.';
        } else {
          initialValues[field.name] = '';
        }
      });
      setShowModal(newShowModal);
      setAddresses(newAddresses);
      setFormData(newRes);
    });
  }, []);

  useEffect(() => {
    getFormData();
  }, [getFormData]);

  const openModal = useCallback(
    (name) => {
      const newShowModal = { ...showModal };
      newShowModal[name] = true;
      setShowModal(newShowModal);
    },
    [showModal]
  );

  const closeModal = useCallback(
    (name) => {
      const newShowModal = { ...showModal };
      newShowModal[name] = false;
      setShowModal(newShowModal);
    },
    [showModal]
  );

  const changeAddress = useCallback(
    (name, value) => {
      const newAdresses = { ...addresses };
      newAdresses[name] = value;
      setAddresses(newAdresses);
    },
    [addresses]
  );

  const renderField = useCallback(
    (field, { values, handleChange, handleBlur, setFieldValue }) => {
      switch (field.type) {
        case 'Text':
          if (field.options) {
            return (
              <Select
                key={field.name}
                name={field.name}
                onBlur={handleBlur}
                value={values[field.name]}
                required={field.required}
                onChange={(value) => {
                  setFieldValue(field.name, value);
                }}
                style={{ width: 120 }}
              >
                {field.options.map((item) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            );
          }
          return (
            <Input
              key={field.name}
              name={field.name}
              placeholder={field.title}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values[field.name]}
              required={field.required}
            />
          );
        case 'Location':
          if (field.options) {
            return (
              <>
                <MapSelectModal
                  items={field.options}
                  onClose={() => {
                    closeModal(field.name);
                  }}
                  visible={showModal[field.name]}
                  onSubmit={(coords) => {
                    setFieldValue(field.name, coords);
                    closeModal(field.name);
                  }}
                />
                <InputGroup compact>
                  <Button type="primary" onClick={() => openModal(field.name)}>
                    انتخاب
                  </Button>
                </InputGroup>
              </>
            );
          }
          return (
            <div key={field.name}>
              <InputGroup compact>
                <Button type="primary" onClick={() => openModal(field.name)}>
                  انتخاب از نقشه
                </Button>
                <Input style={{ width: '50%' }} value={addresses[field.name]} />
              </InputGroup>
              <MapModal
                visible={showModal[field.name]}
                onClose={() => {
                  closeModal(field.name);
                }}
                onSubmit={(coords) => {
                  console.log(coords);
                  setFieldValue(field.name, coords);
                  closeModal(field.name);
                  getAddress(coords.lat, coords.long)
                    .then((address) => changeAddress(field.name, address))
                    /* eslint no-console: ["error", { allow: ["log"] }] */
                    .catch((err) => console.log(err));
                }}
                title={field.title}
              />
            </div>
          );

        default:
          return null;
      }
    },
    [addresses, changeAddress, closeModal, openModal, showModal]
  );
  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <Formik initialValues={initialValues}>
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            {formData.fields.map((field) => renderField(field, props))}
            <Button type="primary">ثبت</Button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default FormScreen;
