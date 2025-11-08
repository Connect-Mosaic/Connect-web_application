import React from "react";
import EventList from "../components/EventList";
import EventForm from "../components/EventForm";

function EventPage(){
    return(
        <div className="event-page">
            <h2>Upcoming events</h2>
            {/*form to create a new event*/}
            <div className="event-form">
                <EventForm/>
            </div>
            <div className="event-list">
                <EventList/>
            </div>

        </div>

    );
}
export default EventPage;