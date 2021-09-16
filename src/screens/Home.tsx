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
        content = <h2>You haven't fetched anything</h2>;
    } else if (props.status === "loading") {
        content = (
            <div className="sk-folding-cube">
                <div className="sk-cube1 sk-cube"></div>
                <div className="sk-cube2 sk-cube"></div>
                <div className="sk-cube4 sk-cube"></div>
                <div className="sk-cube3 sk-cube"></div>
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
