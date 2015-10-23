import React from 'react';

/*
 * Title component, expecting:
 *   'title' property
 *   'title' style class (for section element)
 */
class Title extends React.Component {
    render() {
        return (
            <section className='title'>{this.props.title}</section>
        );
    }
}

export default Title;
