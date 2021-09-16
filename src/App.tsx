import React, { ChangeEvent, useEffect, useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";

import Home from "./screens/Home";
import Liked from "./screens/Liked";

import { ApiObject } from "./types/ApiTypes";

function App() {
    const [status, setStatus] = useState("idle");
    const [skipRun, setSkipRun] = useState<boolean>(true);
    const [apiData, setApiData] = useState<ApiObject[]>([]);
    const [likedApiDataItems, setLikedApiDataItems] = useState<ApiObject[]>([]);
    const [dateRange, setDateRange] = useState({
        startDate: "2021-08-14",
        endDate: "2021-08-15",
    });

    const onChangeStartDate = (e: ChangeEvent<HTMLInputElement>) => {
        setDateRange({ ...dateRange, startDate: e.target.value });
    };

    const onChangeEndDate = (e: ChangeEvent<HTMLInputElement>) => {
        setDateRange({ ...dateRange, endDate: e.target.value });
    };

    const handleItemLike = (k: string) => {
        setApiData(
            apiData.map((item: ApiObject) =>
                item.date === k ? { ...item, liked: !item.liked } : item
            )
        );
    };

    const handleLikedItemUnlike = (k: string) => {
        setLikedApiDataItems(
            likedApiDataItems.filter((item: ApiObject) => item.date !== k)
        );
        if (apiData.length > 0) handleItemLike(k);
    };

    const fetchApi = async (e: any) => {
        if (Date.parse(dateRange.startDate) > Date.parse(dateRange.endDate)) {
            alert("Please enter a valid start date and end date range");
        } else {
            e.preventDefault();
            e.currentTarget.blur();
            setStatus("loading");
            return await fetch(
                `https://api.nasa.gov/planetary/apod?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}&api_key=kp8iztvB9W6tQVPTbh6JuByUVi15YERnFbhJPKVA`
            )
                .then((response) => response.json())
                .then((result) =>
                    setApiData(
                        result.map(
                            (item: ApiObject, i: number) => ({
                                ...item,
                                liked: likedApiDataItems.some(
                                    (likedItem: ApiObject) =>
                                        item.date === likedItem.date
                                ),
                            }),
                            setStatus("loaded")
                        )
                    )
                )
                .catch((error) => setStatus("error"));
        }
    };

    useEffect(() => {
        if (skipRun) setSkipRun(false);
        if (!skipRun)
            setLikedApiDataItems(
                apiData.filter((item: ApiObject) => item.liked)
            );
    }, [apiData]);

    useEffect(() => {
        const data = JSON.parse(localStorage["likedData"]);
        setLikedApiDataItems(data);
    }, []);

    window.onbeforeunload = (event) => {
        const e = event || window.event;
        e.preventDefault();
        localStorage["likedData"] = JSON.stringify(likedApiDataItems);
    };

    console.log("API", apiData);
    console.log("LIKES", likedApiDataItems);

    return (
        <div>
            <div className="header">
                <h2 className="title">Glider</h2>
                <p className="subTitle">
                    Data brought to you by the Picture of the Day API
                </p>

                <Router>
                    <div className="headerOptions">
                        <nav className="mainNav">
                            <ul>
                                <li>
                                    <Link to="/">Home</Link>
                                </li>
                                <li>
                                    <Link to="liked">Liked</Link>
                                </li>
                            </ul>
                        </nav>
                    </div>

                    <Switch>
                        <Route path="/liked">
                            <Liked
                                data={likedApiDataItems}
                                onClickLike={(i: string) =>
                                    handleLikedItemUnlike(i)
                                }
                            />
                        </Route>
                        <Route path="/">
                            <Home
                                data={apiData}
                                onClickLike={(i: string) => handleItemLike(i)}
                                onChangeStartDate={onChangeStartDate}
                                onChangeEndDate={onChangeEndDate}
                                selectedDates={dateRange}
                                handleFetchClick={(e: any) => fetchApi(e)}
                                status={status}
                            />
                        </Route>
                    </Switch>
                </Router>
            </div>
        </div>
    );
}

export default App;
