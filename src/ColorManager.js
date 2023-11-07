import React, { Component } from 'react';
import ColorChangingBoxes from './ColorChanginBoxes';


class ColorManager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colors: [], // Example colors
        };
    }

    componentDidMount() {
        this.updateColors()
        this.timer = setInterval(this.changeColor, 3000);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    updateColors = () => {
        // Generating a new set of colors - replace this with your logic to fetch new colors
        const newColors = ['#FF5733', '#33FF57', '#3366FF', '#FF33EA', '#33FFFF', '#F8FF33'];

        this.setState({ colors: newColors });
    };

    changeColor = () => {
        const { colors } = this.state;
        const randomColor = colors[Math.floor(Math.random() * colors.length)];

        // Pass the random color to the ColorChangingBoxes component
        this.refs.child.addBox(randomColor);
    };

    render() {
        return (
            <div>
                <ColorChangingBoxes ref="child" />
            </div>
        );
    }
}

export default ColorManager;
