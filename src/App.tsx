import React, { ChangeEvent, useEffect, useState } from "react";
import axios from "axios";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.css";

import Home from "./screens/Home";
import Liked from "./screens/Liked";
import NoMatch from "./screens/NoMatch";

import { ApiObject } from "./types/ApiTypes";

function App() {
    const [status, setStatus] = useState("idle");
    const [skipRun, setSkipRun] = useState<boolean>(true);
    const [apiData, setApiData] = useState<ApiObject[]>([]);
    const [likedApiDataItems, setLikedApiDataItems] = useState<ApiObject[]>([]);
    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().setDate(new Date().getDate() - 3))
            .toISOString()
            .substring(0, 10),
        endDate: new Date(new Date().setDate(new Date().getDate() - 1))
            .toISOString()
            .substring(0, 10),
    });

    const onChangeStartDate = (e: ChangeEvent<HTMLInputElement>) => {
        setDateRange({ ...dateRange, startDate: e.target.value });
    };

    const onChangeEndDate = (e: ChangeEvent<HTMLInputElement>) => {
        setDateRange({ ...dateRange, endDate: e.target.value });
    };

    const syncFetchedDataToStoredData = (k: string) => {
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
        if (apiData.length > 0) syncFetchedDataToStoredData(k);
    };

    const fetchApi = async (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        e.currentTarget.blur();
        if (
            Date.parse(dateRange.startDate) > Date.parse(dateRange.endDate) ||
            !dateRange.startDate ||
            !dateRange.endDate
        ) {
            alert("Please select a valid date range");
        } else {
            try {
                setStatus("loading");
                await axios
                    .get(
                        `https://api.nasa.gov/planetary/apod?start_date=${dateRange.startDate}&end_date=${dateRange.endDate}&api_key=kp8iztvB9W6tQVPTbh6JuByUVi15YERnFbhJPKVA`
                    )
                    .then((response) => response.data)
                    .then((res) =>
                        setApiData(
                            res.map(
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
                    );
            } catch (err) {
                setStatus("error");
                console.log("ERROR FETCHING API", err);
            }
        }
    };

    //We are not running an external backend for this application, it's just the UI.
    //Because of this, the website has no memory of past requests and so we need to move
    //arrays around to make new fetched items from the API match up with whatever liked data
    //we had in the local storage previously, while also making sure we are able
    //to sync up any like removals. The initial cross referencing of both of these
    //arrays when we make new GET requests to the API handles most of these concerns,
    //but there are some edge cases that causes liked items to get duplicated, deleted, or become out of sync
    //with the currently fetched items when we like them.
    //Ideally, we would keep just a reference to each API item instead of copying it but, again,
    //there's no external backend to keep track of that so it's just us and Javascript.
    //I'm pretty sure there's some redundancies between this useEffect and one of the handler functions
    //for like removal, but keeping track of past liked items like this is kinda jank in the first place
    //so I'm not even gonna bother.
    //Anyway, this use effect is critical. While the handler functions update the fetched items' liked property,
    //this code right here makes sure that we keep any past liked data while preventing duplicates, since if you set
    //the 'liked' property to be false in one of the newly fetched items, you'd run into the issue that
    //it would still appear as liked since it was that way before the change, and we WANT to keep past data, just
    //not the one that has been changed to unliked, so we filter the data, then take out any data whose 'liked'
    //property is false, and then we delete data from the liked items only if the keys are duplicate in both the past liked data and the newly fetched data
    //, since they can only appear once in both arrays if the item has just been liked, 
    //and will appear twice if it WAS liked but has been unliked
    useEffect(() => {
        if (skipRun) setSkipRun(false);
        if (!skipRun) {
            let tempFilter = apiData.filter((item: ApiObject) => item.liked);
            const ids = [...likedApiDataItems, ...tempFilter].map(
                (o) => o.date
            );
            const filtered = [...likedApiDataItems, ...tempFilter].filter(
                ({ date }, i) => !ids.includes(date, i + 1)
            );
            setLikedApiDataItems(filtered);
        }
    }, [apiData]);

    useEffect(() => {
        try {
            const data = JSON.parse(localStorage["likedData"] || []);
            setLikedApiDataItems(data);
        } catch {
            console.log("likedData empty");
        }
    }, []);

    window.onbeforeunload = (event) => {
        const e = event || window.event;
        e.preventDefault();
        localStorage["likedData"] = JSON.stringify(likedApiDataItems);
    };

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
                        <Route exact path="/">
                            <Home
                                data={apiData}
                                onClickLike={(i: string) =>
                                    handleLikedItemUnlike(i)
                                }
                                onChangeStartDate={onChangeStartDate}
                                onChangeEndDate={onChangeEndDate}
                                selectedDates={dateRange}
                                handleFetchClick={(
                                    e: ChangeEvent<HTMLInputElement>
                                ) => fetchApi(e)}
                                status={status}
                            />
                        </Route>
                        <Route path="/liked">
                            <Liked
                                data={likedApiDataItems}
                                onClickLike={(i: string) =>
                                    handleLikedItemUnlike(i)
                                }
                            />
                        </Route>

                        <Route path="*">
                            <NoMatch />
                        </Route>
                    </Switch>
                </Router>
            </div>
        </div>
    );
}

export default App;
