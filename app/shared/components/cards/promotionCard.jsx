import React from 'react';
import {Link} from 'react-router';
import {Column, Grid, Icon} from '../helper';
import Separator from '../general/separator.jsx';

export default React.createClass({
    displayName: "SuggestShoutCard",

    render() {
        // mock data
        let image = "http://goo.gl/aW2kUD",
            title = "Tesla Model S - Top Deal",
            desc = "It is the place for promotion ad which can be replaced with any commercial info about products or businesses";

        return (
            <section className="si-card promotion-card">
                <Grid fluid={true}>
                    <Link to="">
                        <div style={{backgroundImage:`url(${image})`}} className="prom-image"></div>
                    </Link>
                </Grid>
                <Grid fluid={true}>
                    <Grid fluid={true} className="prom-title">
                        {title}

                    </Grid>
                    <Separator />
                    <p>
                        {desc}
                    </p>

                </Grid>
            </section>
        );
    }
});
