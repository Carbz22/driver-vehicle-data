
import './Drivers.css';
import { useState } from "react";

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

let driverData = require('../../assets/data/drivers.json');

export default function Drivers() {
    const traceHeaders = [];
    const tracesHeaderData = [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ];
    const driverRowClasses = 'Driver-row-column d-flex flex-row justify-content-start align-items-center';

    let filteredDriverData = driverData.data;
    let [driverRows, setDriverRows] = useState(getDriverRows());

    // loop through traces header data and create html elements to display them 
    for (let t = 0; t < tracesHeaderData.length; t++) {
        const traceHeaderClassName = [ 
            'Driver-trace-header',
            t !== tracesHeaderData.length - 1 ? 'mr-2' : '' 
        ].join(' ');

        traceHeaders.push(<div key={tracesHeaderData[t]} className={traceHeaderClassName}>{tracesHeaderData[t]}</div>);
    }

    // on change event called by the 'search for driver' text input
    // it filters drivers based on if the driver's full name or the vehicles registraction number starts with the text input's value
    // I commented out a second version of the filter that does an exact match instead 
    function filterDrivers(event) {
        const filterValue = event.target.value;

        filteredDriverData = filterValue || (filterValue !== '' && filterValue !== null)
            ?  driverData.data.filter(x => `${x.forename} ${x.surname}`.startsWith(filterValue) || x.vehicleRegistration.startsWith(filterValue))
            : driverData.data;

        // filteredDriverData = filterValue || (filterValue !== '' && filterValue !== null)
        //     ?  driverData.data.filter(x => `${x.forename} ${x.surname}` === filterValue || x.vehicleRegistration === filterValue)
        //     : driverData.data;

        const tempDriverRows = getDriverRows();
        setDriverRows(tempDriverRows);
    }

    function getDriverRows() {
        const tempDriverRows = [];
        
        filteredDriverData.forEach(driver => {
            const driverName = `${driver.forename} ${driver.surname}`;
            const driverTraces = [];
            
            // the default list to be used to render the square block html elements for the days of the week 
            const traces = [
                { day: 1, wasDriverActive: false },
                { day: 2, wasDriverActive: false },
                { day: 3, wasDriverActive: false },
                { day: 4, wasDriverActive: false },
                { day: 5, wasDriverActive: false },
                { day: 6, wasDriverActive: false },
                { day: 0, wasDriverActive: false },
            ];

            const flattendedActivities = driver.traces.flatMap(x => x.activity);
            const groupedActivities = getGroupActivities(flattendedActivities, x => x.type);

            // loop through the driver's trace data and calculate which day the trace data falls on.
            // calculate the duration of the drivers activities in minutes
            // update the trace data record's wasDriverActive property to true for the correct trace (calculated off of trace date)
            driver.traces.forEach(trace => {
                const traceDate = new Date(trace.date);
                const traceDay = traceDate.getDay();
                trace = traces.filter(x => x.day === traceDay)[0];
                
                if (trace) {
                    trace.wasDriverActive = true;
                }
            });
    
            // loop through the traces and create the square block html elements
            for (let i = 0; i < traces.length; i++) {
                const driverTraceClassName = [
                    'Driver-trace', 
                    traces[i].wasDriverActive ? 'Green' : '',
                    i !== traces.length - 1 ? 'mr-2' : ''
                ].join(' ');
                
                driverTraces.push(<div key={`${driverName}${traces[i].day}`} className={driverTraceClassName}></div>);
            }

            let activityGroupsValue = '';

            // loop through the activity groups and concat keys and durations into a string 
            groupedActivities.forEach(activityGroup => {
                activityGroupsValue += (groupedActivities.indexOf(activityGroup) !== groupedActivities.length - 1)
                    ? `${activityGroup.key}: ${activityGroup.duration} | ` 
                    : `${activityGroup.key}: ${activityGroup.duration}` ;
            });
            
            // finally create html row element for the given driver
            tempDriverRows.push(
                <Row className="Driver-row mb-1" key={driverName}>
                    <Col xs={3} className={driverRowClasses}>
                        {driverName}
                    </Col>
                    <Col xs={2} className={driverRowClasses}>
                        {driver.vehicleRegistration}
                    </Col>
                    <Col xs={4} className={driverRowClasses}>
                        {/* {duration} minutes */}
                        {activityGroupsValue}
                    </Col>
                    <Col xs={3} className="d-flex flex-row justify-content-start">
                        {driverTraces}
                    </Col>
                </Row>
            ); 
        });

        return tempDriverRows;
    }

    // Groups the list of activities by the type of activity.
    // The groups are a key value pair where key is the type of activity 
    // and the value is the sum of the drivers duration for the given activitiy.
    // Returns a sorted list (sorted by key descending)
    function getGroupActivities(fullActivityList, keyFunc) {
        const result = [];

        fullActivityList.forEach(activity => {
            const key = keyFunc(activity);
            let resultActivity = result.filter(x => x.key === key)[0];

            if (!resultActivity || !resultActivity.duration) {
                const duration = activity.duration;
                resultActivity = { key, duration };
                result.push(resultActivity)
            } else {
                resultActivity.duration += activity.duration;
            }
        });

        return result.sort(compare);
    }

    function compare(a, b) {
        if (a.key < b.key) {
          return -1;
        }

        if (a.key > b.key) {
          return 1;
        }

        return 0;
    }

    return (
        <Container fluid="xs">
            <Row className="mb-1">
                <Col xs={4}>
                    <Form>
                        <Form.Group>
                            <Form.Control type="text" placeholder="Search for driver..." onChange={filterDrivers}></Form.Control>
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
            <Row>
                <Col xs={9}></Col>
                <Col xs={3} className="d-flex flex-row justify-content-start">
                    {traceHeaders}
                </Col>
            </Row>
            {driverRows}
        </Container>
    );
}