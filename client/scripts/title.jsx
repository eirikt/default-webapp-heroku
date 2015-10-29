/* eslint-disable no-unused-vars */

import React from 'react';

/*
 * Title component, expecting:
 *   'title' property
 *   'title' style class (for section element)
 */
const Title = ({ title }) => (
    <section className='title'>{ title }</section>
);

export default Title;
