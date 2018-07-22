import React from 'react'
import axios from 'axios'
import { TimeSeries } from "pondjs"
import { Charts, 
  ChartContainer, 
  ChartRow, 
  YAxis, 
  LineChart, 
  Legend, 
  styler,
  Resizable } from "react-timeseries-charts" // pagina da API http://software.es.net/react-timeseries-charts/

class Main extends React.Component {

  constructor() {
    super();

    this.state = {
      points: [
        [0, 0]
      ]
    }
  }

  // Faz o pedido à rest e faz o setState à variavel de estado
  componentDidMount() {
    axios.get("http://172.20.1.10:3000/api/Productions?filter[limit]=100")
      .then(function (response) {
        let points = response.data.map((obj) => {
          let auxObj = {}
          auxObj = [Date.parse(obj.receivedOn), obj.data.qty_good]
          return auxObj
        })
        this.setState({ points: points })
      }.bind(this))
  }

  render() {
    let qtyValue
    if (this.state.tracker) {
      const index = currencySeries.bisect(this.state.tracker)
      const trackerEvent = currencySeries.at(index)
      qtyValue = `${f(trackerEvent.get("value"))}`
    }

    const style = styler([
      { key: "value", color: "steelblue", width: 1, dashed: true },
    ]);

    const points = this.state.points
    const series = new TimeSeries({
      name: "USD_vs_EURO",
      columns: ["time", "value"], points
    });


    return (
      <div className="wrapper wrapper-content animated fadeInRight">
        <div className="row">
          <div className="col-lg-12">
            <Legend
              type="line"
              align="right"
              style={style}
              highlight={this.state.highlight}
              onHighlightChange={highlight => this.setState({ highlight })}
              selection={this.state.selection}
              onSelectionChange={selection => this.setState({ selection })}
              categories={[
                { key: "value", label: "Qty", value: qtyValue },
              ]}
            />
            <div className="text-center m-t-lg">
            <Resizable>
              <ChartContainer timeRange={series.timerange()}
                trackerPosition={this.state.tracker}
                onTrackerChanged={this.handleTrackerChanged}
                onBackgroundClick={() => this.setState({ selection: null })}
                enablePanZoom={true}
                onTimeRangeChanged={this.handleTimeRangeChange}>
                <ChartRow height="600">
                  <YAxis id="axis1" label="Qty" min={0} max={300} width="60" type="linear" />
                  <Charts>
                    <LineChart axis="axis1" series={series} />
                  </Charts>
                </ChartRow>
              </ChartContainer>
              </Resizable>
            </div>
          </div>
        </div>
      </div>
    )
  }

}
export default Main