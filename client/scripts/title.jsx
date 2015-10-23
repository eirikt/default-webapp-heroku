import React from 'react';

    /*
     * Title component, expecting:
     *   'title' property
     *   'title' section style class
     */
var Title = React.createClass({
        render: function() {
            return (
                <section className='title'>{this.props.title}</section>
            );
        }
    });

export default Title;
