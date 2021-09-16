import React from "react";

interface Props {
    imageUrl: string;
    hdIMageUrl: string;
    title: string;
    description: string;
    date: string;
    onClickLike: Function;
    liked: boolean;
}

const Card = (props: Props) => {
    return (
        <div className="card">
            {props.imageUrl.includes("youtube") ? (
                <iframe src={props.imageUrl} title={props.title} width="100%" />
            ) : (
                <img src={props.imageUrl} alt={props.title} width="100%" />
            )}

            <div className="cardContent">
                <h3>
                    {new Date(props.date).toLocaleString("en-us", {
                        month: "long",
                        year: "numeric",
                        day: "numeric",
                    })}
                </h3>
                <h2>{props.title}</h2>
                <p>{props.description}</p>
                <div className="cardActionSection">
                    <button>
                        <a href={props.hdIMageUrl} target="_blank">
                            <img
                                src={
                                    require("../assets/icons/maximize-2.svg")
                                        .default
                                }
                                alt={props.title}
                            />
                        </a>
                    </button>

                    <button onClick={() => props.onClickLike()}>
                        {props.liked ? (
                            <img
                                src={
                                    require("../assets/icons/heart-filled.svg")
                                        .default
                                }
                                alt={props.title}
                            />
                        ) : (
                            <img
                                src={
                                    require("../assets/icons/heart.svg").default
                                }
                                alt={props.title}
                            />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Card;
