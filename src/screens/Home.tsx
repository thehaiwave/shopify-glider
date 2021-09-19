import React from "react";
import { ApiObject } from "../types/ApiTypes";

import Card from "../components/Card";

interface DateObj {
    startDate: string;
    endDate: string;
}

interface Props {
    data: ApiObject[];
    onClickLike: Function;
    onChangeStartDate: Function;
    onChangeEndDate: Function;
    selectedDates: DateObj;
    handleFetchClick: Function;
    status: string;
}

const Home = (props: Props) => {
    let content;

    if (props.status === "idle") {
        content = <h2 className="noneMessage">You haven't fetched anything</h2>;
    } else if (props.status === "loading") {
        content = (
            <div className="sk-circle">
                <div className="sk-circle1 sk-child"></div>
                <div className="sk-circle2 sk-child"></div>
                <div className="sk-circle3 sk-child"></div>
                <div className="sk-circle4 sk-child"></div>
                <div className="sk-circle5 sk-child"></div>
                <div className="sk-circle6 sk-child"></div>
                <div className="sk-circle7 sk-child"></div>
                <div className="sk-circle8 sk-child"></div>
                <div className="sk-circle9 sk-child"></div>
                <div className="sk-circle10 sk-child"></div>
                <div className="sk-circle11 sk-child"></div>
                <div className="sk-circle12 sk-child"></div>
            </div>
        );
    } else if (props.status === "loaded") {
        content = (
            <div className="sematary">
                {props.data.map((item: ApiObject, i: number) => {
                    return (
                        <Card
                            key={i}
                            title={item.title}
                            imageUrl={item.url}
                            hdIMageUrl={item.hdurl}
                            description={item.explanation}
                            date={item.date}
                            onClickLike={() => props.onClickLike(item.date)}
                            liked={item.liked}
                        />
                    );
                })}
            </div>
        );
    } else if (props.status === "error") {
        content = <h2>There was an error fetching the data</h2>;
    }

    return (
        <>
            <form>
                <div className="datesSelector">
                    <div className="startBlock">
                        <label>Start Date</label>
                        <input
                            type="date"
                            id="start-date"
                            name="start-date"
                            value={props.selectedDates.startDate}
                            onChange={(e) => props.onChangeStartDate(e)}
                        />
                    </div>
                    <div className="endBlock">
                        <label>End Date</label>
                        <input
                            type="date"
                            id="end-date"
                            name="end-date"
                            value={props.selectedDates.endDate}
                            onChange={(e) => props.onChangeEndDate(e)}
                        />
                    </div>
                </div>
                <button
                    className="fetchButton"
                    onClick={(e) => props.handleFetchClick(e)}
                >
                    FETCH
                </button>
            </form>
            {content}
        </>
    );
};

export default Home;
