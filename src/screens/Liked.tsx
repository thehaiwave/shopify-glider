import React from "react";
import { ApiObject } from "../types/ApiTypes";

import Card from "../components/Card";

interface Props {
    data: ApiObject[];
    onClickLike: Function;
}

const Liked = (props: Props) => {
    return (
        <>
            {props.data.length > 0 ? (
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
            ) : (
                <h2>You haven't liked anything :(</h2>
            )}
        </>
    );
};

export default Liked;
