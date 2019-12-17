import React, { useCallback } from "react";
import { Input, Select, Button } from "antd";
import { Formik } from "formik";
import GoogleMapReact from "google-map-react";

const { Option } = Select;

const FORM_DATA = {
  title: "A smaple form",
  id: "1234",
  fields: [
    {
      name: "First_Name",
      title: "First Name",
      type: "Text",
      required: true
    },
    {
      name: "Loc",
      title: "Your Location",
      type: "Location",
      required: false
    },

    {
      name: "Request_Type",
      title: "Request Type",
      type: "Text",
      options: [
        { label: "Help", value: "Help" },
        { label: "Info", value: "Information" }
      ]
    },
    {
      name: "Base_Location",
      title: "Base Location",
      type: "Location",
      options: [
        { label: "Base1", value: { lat: "1.2", long: "3.2" } },
        { label: "Base2", value: { lat: "2.3", long: "1.434" } }
      ]
    }
  ]
};

const initialValues = {};

FORM_DATA.fields.forEach(field => {
  initialValues[field.name] = "";
});

const FormScreen = props => {
  const renderField = useCallback(
    (field, { values, handleChange, handleBlur, setFieldValue }) => {
      switch (field.type) {
        case "Text":
          if (field.options) {
            return (
              <Select
                key={field.name}
                name={field.name}
                onBlur={handleBlur}
                value={values[field.name]}
                required={field.required}
                onChange={value => {
                  setFieldValue(field.name, value);
                }}
                style={{ width: 120 }}
              >
                {field.options.map(item => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            );
          } else
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
        case "Location":
          return null;
        default:
          return null;
      }
    },
    []
  );
  console.log(process.env);
  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.REACT_APP_API_KEY }}
        defaultCenter={{
          lat: 59.95,
          lng: 30.33
        }}
        defaultZoom={11}
      />
      <Formik initialValues={initialValues} onSubmit={an => console.log(an)}>
        {props => (
          <form onSubmit={props.handleSubmit}>
            {FORM_DATA.fields.map(field => renderField(field, props))}
            <Button type="primary">ثبت</Button>
          </form>
        )}
      </Formik>
    </div>
  );
};

export default FormScreen;
