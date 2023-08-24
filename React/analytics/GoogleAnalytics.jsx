import React, { useEffect, useState } from "react";
import * as googleService from "../../../services/googleAnalyticsService";
import "./googleAnalytics.css";
import { Fragment } from "react";
import { Col, Row, Card, Spinner } from "react-bootstrap";
import ApexCharts from "./ApexCharts";
import {
  SessionChartSeries,
  SessionChartOptions,
  TrafficChannelChartSeries,
  TrafficChannelChartOptions,
  UserCountryChartSeries,
  UserCountyChartOptions,
} from "components/dashboard/analytics/ChartData";
import { Field, Formik, Form } from "formik";
import dateSchema from "../../../schemas/gAnalyticsDateSchema";

import debug from "sabio-debug";
const _logger = debug.extend("GA4");

const GoogleAnalytics = () => {
  const today = new Date().toISOString().slice(0, 10);
  const firstDayOfProduct = new Date("04/11/2023").toISOString().slice(0, 10);
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState({});
  const [organizedReport, setOgranizedReport] = useState({});
  const [dateSelected, setDateSelected] = useState({
    startDate: new Date(new Date().getTime() - 6 * 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10),
    endDate: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    if (dateSelected.endDate !== "" || dateSelected.endDate !== null) {
      googleService
        .getReport(dateSelected.startDate, dateSelected.endDate)
        .then(onGetReportSuccess)
        .catch(onGetReportError);
    }
  }, [dateSelected]);

  const onGetReportSuccess = (data) => {
    setReport(() => data.item);
    setOgranizedReport(() => {
      const orgReport = {};
      data.item.reports[0].data.rows.forEach((row) => {
        const date = row.dimensions[0].substring(4);
        const dateFormat = date.slice(0, 2) + "/" + date.slice(2);
        const browser = row.dimensions[1];
        const sessions = parseInt(row.metrics[0].values[0]);

        if (!orgReport[dateFormat]) {
          orgReport[dateFormat] = {};
        }

        orgReport[dateFormat][browser] = [sessions];
      });

      return orgReport;
    });
  };

  const onGetReportError = (error) => {
    _logger(error);
  };

  useEffect(() => {
    if (report.reports) {
      setLoading(false);
    }
    setOgranizedReport(() => {
      const newState = organizedReport;
      return newState;
    });
  }, [report]);

  const onSelectDate = (e) => {
    const newDateValue = e.target.value;
    const endDate = newDateValue === "" ? new Date() : new Date(newDateValue);
    if (e.target.name === "endDate") {
      setDateSelected((prevState) => ({
        ...prevState,
        endDate: endDate.toISOString().slice(0, 10),
      }));
    } else if (e.target.name === "startDate") {
      setDateSelected((prevState) => ({
        ...prevState,
        startDate: newDateValue,
      }));
    }
  };

  return (
    <Fragment>
      <Row className="pb-3">
        <Col xl={6} lg={6} md={6} sm={6} xs={6}>
          <h3 className="dashboard-font pt-3 pb-5">Google Analytics</h3>
        </Col>
        <Col xl={6} lg={6} md={6} sm={6} xs={6} className="ml-auto pt-4">
          <Formik
            enableReinitialize={true}
            initialValues={dateSelected.endDate}
            validationSchema={dateSchema}
          >
            <Form className="d-flex">
              <Col xs={6} md={6} lg={6} className="d-flex align-items-center">
                <label htmlFor="startDate" className="me-2 fw-bold pe-2">
                  Start
                </label>
                <Field
                  id="startDate"
                  name="startDate"
                  type="date"
                  min={firstDayOfProduct}
                  max={today}
                  onChange={onSelectDate}
                  value={dateSelected.startDate}
                  className="form-control form-control-sm"
                />
              </Col>
              <Col xs={6} md={6} lg={6} className="d-flex align-items-center">
                <label htmlFor="endDate" className="me-2 fw-bold ps-2">
                  End
                </label>
                <Field
                  id="endDate"
                  name="endDate"
                  type="date"
                  min={firstDayOfProduct}
                  max={today}
                  onChange={onSelectDate}
                  value={dateSelected.endDate}
                  className="form-control form-control-sm"
                />
              </Col>
            </Form>
          </Formik>
        </Col>
      </Row>
      <Row className="d-flex align-items-stretch">
        <Col xl={4} lg={4} md={12} className="mb-4 h-100">
          <Card className="h-100 shadow-lg border-dark">
            <Card.Body className="p-1 py-3">
              {loading ? (
                <div className="d-flex align-items-center justify-content-center ga-sm-graph-ht">
                  <Spinner className="ga-spinner-size" />
                </div>
              ) : (
                <ApexCharts
                  options={SessionChartOptions({
                    report: report.reports[0].data.rows,
                    sortedDays: organizedReport,
                  })}
                  series={SessionChartSeries({
                    report: report.reports[0].data.rows,
                    sortedDays: organizedReport,
                  })}
                  type="line"
                  height={450}
                />
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xl={4} lg={4} md={12} className="mb-4 h-100">
          <Card className="h-100 shadow-lg border-dark">
            <Card.Body className="p-1 py-3 mb-3">
              {loading ? (
                <div className="d-flex align-items-center justify-content-center ga-sm-graph-ht">
                  <Spinner className="ga-spinner-size" />
                </div>
              ) : (
                <ApexCharts
                  className="mb-4 h-100"
                  options={UserCountyChartOptions({
                    report: report.reports[2].data.rows,
                  })}
                  series={UserCountryChartSeries({
                    report: report.reports[2].data.rows,
                  })}
                  type="donut"
                  height={480}
                />
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col xl={4} lg={4} md={12} className="mb-4 h-100">
          <Card className="h-100 shadow-lg border-dark">
            <Card.Body className="pt-3 pb-0">
              {loading ? (
                <div className="d-flex align-items-center justify-content-center ga-sm-graph-ht">
                  <Spinner className="ga-spinner-size" />
                </div>
              ) : (
                <ApexCharts
                  options={TrafficChannelChartOptions}
                  series={TrafficChannelChartSeries({
                    report: report.reports[1],
                  })}
                  type="bar"
                  height={470}
                />
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default GoogleAnalytics;
