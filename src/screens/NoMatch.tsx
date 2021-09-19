import { useLocation } from "react-router";

const NoMatch = () => {
    let location = useLocation();

    return (
        <div>
            <h1>404</h1>
            <h2>
                No matching route for <code>{location.pathname}</code>
            </h2>
        </div>
    );
};

export default NoMatch;
