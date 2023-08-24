import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import contactUsSchema from "schemas/contactUsSchema";
import debug from "sabio-debug";
import contactService from "services/contactUsService";
import toastr from "toastr";
import { Card, Container } from "react-bootstrap";

const _logger = debug.extend("ContactUs");

function ContactUs() {
  const [initialFormData, resetFormData] = useState({
    senderName: "",
    senderEmail: "",
    senderMessage: "",
  });

  const handleSubmit = (values) => {
    _logger("values in handlesubmit in contact us", values);
    contactService
      .contactUs(values)
      .then(onContactUsSuccess)
      .catch(onContactUsError);
  };

  function onContactUsSuccess(response) {
    _logger("onContactUsSuccess", response);
    toastr.success(
      "Message sent successfully",
      "Thank you for reaching out to our team."
    );
    resetFormData("");
  }

  function onContactUsError(error) {
    _logger("onContactUsError", error);
    toastr.error(
      "Could not send your message please try again",
      "Error on submission"
    );
  }

  return (
    <React.Fragment>
      <Container className="p-3">
        <h1 className="text-center pt-3">Contact Us</h1>
        <h5 className="text-center pb-3">
          Have a question? We would love to hear from you. Send us a message and
          we will respond as soon as possible.
        </h5>
        <Card>
          <Card.Body>
            <Formik
              enableReinitialize={true}
              initialValues={initialFormData}
              onSubmit={handleSubmit}
              validationSchema={contactUsSchema}
            >
              <Form>
                <label htmlFor="senderMessage" className="form-label">
                  Full Name <span className="text-danger">*</span>
                </label>
                <Field
                  type="text"
                  name="senderName"
                  id="senderName"
                  placeholder="Your Name"
                  className="form-control p-2"
                />
                <div className="has-error">
                  <ErrorMessage
                    name="senderName"
                    components="div"
                    className="has-error p-2"
                  />
                </div>
                <label htmlFor="senderMessage" className="form-label pt-3">
                  Email Address <span className="text-danger">*</span>
                </label>
                <Field
                  type="senderEmail"
                  name="senderEmail"
                  id="senderEmail"
                  placeholder="Your Email"
                  className="form-control p-2"
                />
                <div className="has-error">
                  <ErrorMessage
                    name="senderEmail"
                    components="div"
                    className="has-error p-2"
                  />
                </div>

                <label htmlFor="senderMessage" className="form-label pt-3">
                  Your Message <span className="text-danger">*</span>
                </label>
                <Field
                  as="textarea"
                  id="senderMessage"
                  name="senderMessage"
                  placeholder="Write Your Message Here"
                  className="form-control p-2"
                  rows="10"
                />
                <div className="has-error">
                  <ErrorMessage
                    name="senderMessage"
                    components="div"
                    className="has-error p-2"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary mr-3 pt-3 mt-2"
                >
                  Submit
                </button>
              </Form>
            </Formik>
          </Card.Body>
        </Card>
      </Container>
    </React.Fragment>
  );
}
export default ContactUs;
