import React, { Component } from 'react';

class ColorChangingBoxes extends Component {
    constructor(props) {
        super(props);
        this.state = {
            boxes: [],
        };
        this.boxContainerRef = React.createRef();
        console.log('Here inside color changing boxes')
    }

    addBox = (color) => {
        const newBox = (
            <span
                key={this.state.boxes.length}
                style={{
                    border: '1px solid #000',
                    width: '13px',
                    height: '2px',
                    display: 'inline-block',
                    padding: '4px',
                    margin: '2px',
                    transition: 'background-color 0.5s, transform 0.3s',
                    backgroundColor: color
                }}
            />
        );

        this.setState(prevState => ({
            boxes: [...prevState.boxes, newBox],
        }), () => {
            if (this.boxContainerRef.current) {
                this.boxContainerRef.current.scrollLeft = this.boxContainerRef.current.scrollWidth;
            }
        });
    };

    render() {
        return (
            <div style={{ display: 'flex' }}>
                <div
                    className="box-container"
                    style={{
                        width: '70%',
                        height: '30px',
                        overflowX: 'auto',
                        padding: '10px',
                        left: '30%'
                    }}
                    ref={this.boxContainerRef}
                >
                    <div style={{ display: 'flex' }}>
                        {this.state.boxes.map((box, index) => (
                            <div key={index} style={{ marginRight: '1px' }}>
                                {box}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}

export default ColorChangingBoxes;
