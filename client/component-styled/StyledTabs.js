import {makeStyles} from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import React from "react";

export default function StyledTabs (arg) {
    const {valueList, value, onChange, orientation, component} = arg;
    const getStyle = (theme) => {
        if (component === 'mapSelector') {
            return {
                root: {
                    flexGrow: 1,
                    display: 'flex-start',
                },
                tabs: {
                    borderRight: `0px solid ${theme.palette.divider}`,
                },
                indicator: {
                    left: "0px",
                    width: "8px",
                    borderTopRightRadius: "16px",
                    borderBottomRightRadius: "16px",
                    backgroundImage: "linear-gradient(180deg, #a4508b 0%, #5f0a87 74%)",
                },
            }
        } else if (component === 'sign') {
            return {
                indicator: {
                    // top: "0px",
                    // width: "8px",
                    // borderTopRightRadius: "16px",
                    // borderBottomRightRadius: "16px",
                    // backgroundImage: "linear-gradient(180deg, #a4508b 0%, #5f0a87 74%)",
                },
            }
        }
    }
    const classes = makeStyles((theme) => (getStyle(theme)))()
    return (
        <div className={classes.root}>
            <Tabs
                classes={{
                    indicator: classes.indicator
                }}
                orientation={orientation}
                variant="scrollable"
                aria-label="Vertical tabs example"
                className={classes.tabs}
                value={value}
                onChange={onChange}
                indicatorColor="primary">
                {valueList.map((name, index) => (
                    <Tab
                        label={name}
                        key={index}/>
                ))}>
            </Tabs>
        </div>
    )
}
