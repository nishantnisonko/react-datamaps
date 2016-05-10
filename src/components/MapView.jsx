import React, {PropTypes} from 'react';
import Datamap from './DataMap';
import data from './data';
import RadioGroup from 'react-radio-group';

export default class MapView extends React.Component {
    constructor(props) {
        super(props);
        var dataset = {};
        var onlyValues = data.series.map(function(obj) {
            return obj[1];
        });
        var minValue = Math.min.apply(null, onlyValues),
            maxValue = Math.max.apply(null, onlyValues);

        var paletteScale = d3.scale.linear().domain([minValue, maxValue]).range(["#ffe0cc", "#ff471a"]);
        data.series.forEach(function(item) {
            var iso = item[0],
                value = item[1],
                region = item[2];
            dataset[iso] = {
                numberOfThings: value,
                fillColor: paletteScale(value),
                region: region
            };
        });
        this.state = {
            scope: 'world',
            selectedRegion:'ALL',
            allData: dataset,
            data: dataset,
            fills: {
                defaultFill: '#ddd'
            },
            geographyConfig: {
                borderColor: '#888',
                borderWidth: .5,
                highlightBorderWidth: .5,
                highlightBorderColor: 'black',
                highlightFillColor: function(geo) {
                    return geo['fillColor'] || '#ddd';
                },
                popupTemplate: function(geo, data) {
                    if (!data) {
                        return;
                    }
                    return [
                        '<div class="hoverinfo">',
                        '<strong>',
                        geo.properties.name,
                        '</strong>',
                        '<br>Count: <strong>',
                        data.numberOfThings,
                        '</strong>',
                        '</div>'
                    ].join('');
                }
            }
        };

    }

    update = (region) => {
        var _this = this;
        let filteredData = Object.keys(this.state.allData).filter(function(country) {
            let item = _this.state.allData[country];
            if (item.region === region || 'ALL' === region) {
                return true;
            } else {
                return false;
            }
        });

        let regionData = {};
        filteredData.map(function(country) {
            regionData[country] = _this.state.allData[country];
        });

        this.setState(Object.assign({}, {
            data: regionData,
            selectedRegion:region
        }, window.example));
    }

    render() {
        return (
            <div className="App">
                <div className="App-options">
                    <RadioGroup name="fruit" selectedValue={this.state.selectedRegion} onChange={this.update}>
                        {Radio => (
                            <div>
                                <Radio value="AMR"/>AMR
                                <Radio value="APAC"/>APAC
                                <Radio value="EMEA"/>EMEA
                                <Radio value="ALL"/>ALL

                            </div>
                        )}
                    </RadioGroup>

                </div>
                <div className="App-map">
                    <Datamap {...this.state}/>
                </div>
            </div>
        );
    }
}
