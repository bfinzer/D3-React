import React, {Component} from 'react';
import * as d3 from "d3";
import './d3_play.css';
import {graphingTypes} from "./graphing-types";

const kInitialDimensions = {
	width: 500,
	height: 700
}

class Axis extends Component<graphingTypes.axisProps, {}> {
	ref: SVGSVGElement | null = null
	axis: any

	constructor(props: graphingTypes.axisProps) {
		super(props);
		switch (props.orientation) {
			case "bottom":
				this.axis = d3.axisBottom
				break
			case 'left':
				this.axis = d3.axisLeft
		}
	}

	componentDidMount() {
		d3.select(this.ref)
			.append('g')
			.attr("transform", this.props.transform)
			.call(this.axis(this.props.scaleLinear))
	}

	render() {
		return (
			<g className='axis' ref={(ref: SVGSVGElement) => this.ref = ref}/>
		)
	}
}

class ScatterDots extends Component<graphingTypes.scatterDotsProps, { dragCounter:number, dragIndex: number }> {
	ref: SVGSVGElement | null = null

	constructor(props: graphingTypes.scatterDotsProps) {
		super(props);
		this.state = {dragCounter: 0, dragIndex: -1}
	}

	componentDidMount() {
		const this_ = this,
			float = d3.format('.1f')

		function onDragStart(d: any, index: number) {
			this_.setState({dragIndex: index})
			// @ts-ignore
			d3.select(this)
				.transition()
				.attr('r', 10)
		}

		function onDrag(d: any, index: number) {
			if( d3.event.dx !== 0 || d3.event.dy !== 0) {
				const deltaX = this_.props.xScale.invert(d3.event.dx) - this_.props.xScale.invert(0),
					deltaY = this_.props.yScale.invert(d3.event.dy) - this_.props.yScale.invert(0)
				this_.props.scatterData[index].x += deltaX
				this_.props.scatterData[index].y += deltaY
				this_.setState({dragCounter: this_.state.dragCounter + 1})
			}
		}

		function onDragEnd(/*d: any*/) {
			// @ts-ignore
			d3.select(this)
				.transition()
				.attr('r', 3)
		}

/*
		function clicked(d: any, event: any) {
		}
*/

		console.log(`this.ref.current.width = ${this.ref && this.ref.width}`)
		const data = this.props.scatterData,
			delayInterval = 500 / data.length,
			svg:any = d3.select(this.ref),
			circleSet: any = svg.append('g')
			.attr('transform', this.props.transform)
			.selectAll("dot")
			.data(this.props.scatterData)
		circleSet.enter()
			.append("circle")
				.attr("r", 3)
				.attr('cx', this.props.xScale.range()[1] / 2)
				.attr('cy', this.props.yScale.range()[0] / 2)
				.style("fill", "#e89376")
				// .style("opacity", 0)
				.attr('stroke', 'white')
				.attr('cursor', 'pointer')
			// @ts-ignore
			.call(d3.drag()
				// .on('click', clicked)
				.on("start", onDragStart)
				.on("drag", onDrag)
				.on("end", onDragEnd))
			.append('title')
			.text((d: any) => `(${float(d.x)}, ${float(d.y)}`)

		svg.selectAll('circle')
			.data(this.props.scatterData)
			.transition()
			.delay((d:any, i:number)=> {
				return i * delayInterval
			})
			.duration(1000)
			.attr("cx", (d: { x: any; }) => this_.props.xScale(d.x))
			.attr("cy", (d: { y: any; }) => this_.props.yScale(d.y))
			// .style("opacity", 1)
	}

	componentDidUpdate(prevProps: Readonly<graphingTypes.scatterDotsProps>, prevState: Readonly<any>, snapshot?: any) {
		const this_ = this,
			svg = d3.select(this_.ref),
			circleSet = svg.selectAll('circle')
				.data(this.props.scatterData)
		circleSet.merge(circleSet)
			.attr("cx", d => this_.props.xScale(d.x))
			.attr("cy", d => this_.props.yScale(d.y))
	}

	render() {
		return (
			<g className='dots' ref={(ref: SVGSVGElement) => this.ref = ref}/>
		)
	}
}

class D3_Play extends Component<{}, {}> {
	data: { x: number, y: number, selected:boolean }[] = d3.range(10000).map(() => {
		return {
			x: d3.randomUniform(0, 20)(),
			y: d3.randomNormal(10, 2)(),
			selected: false
		}
	})
	xMin = (d3.min(this.data, d => d.x) || 0) - 1
	xMax = (d3.max(this.data, d => d.x) || 20) + 1
	yMin = (d3.min(this.data, d => d.y) || 0) - 1
	yMax = (d3.max(this.data, d => d.y) || 20) + 1
	margin = ({top: 10, right: 30, bottom: 30, left: 60})
	width = 460 - this.margin.left - this.margin.right
	height = 400 - this.margin.top - this.margin.bottom
	x = d3.scaleLinear()
		.domain([this.xMin, this.xMax])
		.range([0, this.width])
	y = d3.scaleLinear()
		.domain([this.yMin, this.yMax])
		.range([this.height, 0])

	public render() {
		return (
			<div className="App">
				<h3> Drawing with d3 </h3>

				<svg className="d3Drawing"
						 width={kInitialDimensions.width}
						 height={kInitialDimensions.height}
				>
					<Axis orientation={'left'}
								scaleLinear={this.y}
								transform={`translate(${this.margin.left}, 0)`}
					/>
					<Axis orientation={'bottom'}
								scaleLinear={this.x}
								transform={`translate(${this.margin.left}, ${this.height})`}
					/>
					<ScatterDots scatterData={this.data}
											 xScale={this.x} yScale={this.y}
											 transform={`translate(${this.margin.left}, 0)`}
					/>
				</svg>
			</div>
		);
	}

}

export default D3_Play;
