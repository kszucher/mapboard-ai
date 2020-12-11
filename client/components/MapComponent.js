import React, {useContext} from "react";
import {Context} from "../core/Store";
import {Workspace} from "./Workspace";
import SignIn from "./SignIn";

export function MapComponent() {

    const [state, dispatch] = useContext(Context);





    return(
        <div id='mapDiv'>
            <svg id="mapSvg"/>
        </div>
    )
}
