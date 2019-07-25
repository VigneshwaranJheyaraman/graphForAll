import React, {Component} from 'react';
class Canvas extends Component
{
	constructor(props)
	{
		super(props);
		this.state ={
			xAxisCD: 0,
			yAxisCD :0,
			graphCanvas : null,
			graphMargin: 40,
			mouseX:0,
			mouseY:0,
			graphPointsMargin:30,
			rangeOfPoints: 20,
			graphBoxSize:40,
			resizeFactor:5,
			coordMarkerWidth : 10,
			xAxis:[],
			yAxis:[],
			pointArcColor : "#f00",
			legendWidth: 400,
			legendTitleTopMargin : 20,
			legnedPointsBottomMargin:10,
			crossHairToggleValue:true,
			colorPicker: null,
			graphColor : null
		};
		this.canvasRef = React.createRef();
		this.getXAxisCD = this.getXAxisCD.bind(this);
		this.getYAxisCD = this.getYAxisCD.bind(this);
		this.drawCrossHair = this.drawCrossHair.bind(this);
		this.drawAxes = this.drawAxes.bind(this);
		this.handleMouseMovement = this.handleMouseMovement.bind(this);
		this.resizer = this.resizer.bind(this);
		this.plotAxesValues = this.plotAxesValues.bind(this);
		this.plotDataPoints = this.plotDataPoints.bind(this);
		this.drawLegend = this.drawLegend.bind(this);
		this.drawLegendPoints = this.drawLegendPoints.bind(this);
		this.crossHairToggler = this.crossHairToggler.bind(this);
		this.handleClickEvent = this.handleClickEvent.bind(this);
		this.inputColorPickerRef = React.createRef();
		this.graphColorPicker = this.graphColorPicker.bind(this);
		this.checkColorChangerClicked = this.checkColorChangerClicked.bind(this);
	}
	componentWillMount()
	{
		//draw the cooridinates based on the data set
		if(this.props.xAxis !== undefined && this.props.yAxis !== undefined)
		{
			let xmean = this.getXAxisCD(this.props.xAxis);
			let ymean = this.getYAxisCD(this.props.yAxis);
			this.setState({xAxisCD :  xmean ,
				yAxisCD : ymean,
				xAxis:this.props.xAxis,
				yAxis: this.props.yAxis,
				graphColor: this.props.graphColor !== undefined ? this.props.graphColor : "#000"
			}, () => {
				//console.log(this.state.yAxisCD, this.state.xAxisCD);
			});
			//console.log(this.props.xAxis, this.props.yAxis);
		}
	}

	plotAxesValues()
	{
		let context = this.state.graphCanvas.getContext("2d");
		//xaxis
		context.beginPath();
		context.moveTo(this.state.graphMargin, this.state.graphMargin);
		context.font = "14px serif";
		let stepSize = 0;
		for(var i= this.state.graphMargin; i<= (this.state.graphCanvas.width - this.state.graphMargin); i += this.state.graphBoxSize)
		{
			context.strokeText(`${parseInt(this.getMinElement(this.state.xAxis) > 0 ?stepSize : this.getMinElement(this.state.xAxis)+ stepSize)}`, i, (this.state.graphCanvas.height - this.state.graphMargin)+this.state.graphPointsMargin);
			context.moveTo(i, (this.state.graphCanvas.height - this.state.graphMargin));
			context.lineTo(i, (this.state.graphCanvas.height - this.state.graphMargin) - this.state.coordMarkerWidth);
			context.lineWidth = 1;
			context.stroke();
			stepSize += this.state.xAxisCD;
		}
		context.closePath();
		//yAxis
		context.beginPath();
		stepSize = 0;
		context.moveTo(this.state.graphMargin, this.state.graphMargin);
		context.font ="14px serif";
		/* for(i = (this.state.graphCanvas.height - this.state.graphMargin); i>= this.state.graphMargin; i-= this.state.yAxisMean)
		{
			context.strokeText(`${parseInt(i + this.state.graphMargin)}`, this.state.graphMargin, this.state.graphCanvas.height - i);
		} */
		for(i=this.state.graphMargin;i<= (this.state.graphCanvas.height - this.state.graphMargin);i+= this.state.graphBoxSize)
		{
			context.strokeText(`${parseInt(this.getMinElement(this.state.yAxis) > 0 ? stepSize :this.getMinElement(this.state.yAxis)+ stepSize)}`, this.state.graphMargin - this.state.graphPointsMargin, i);
			context.moveTo(this.state.graphMargin, i);
			context.lineTo(this.state.graphMargin - this.state.coordMarkerWidth, i);
			context.lineWidth = 1;
			context.stroke();
			stepSize += this.state.yAxisCD;
		}
		context.closePath();
	}

	componentDidMount()
	{
		this.setState({graphCanvas : this.canvasRef.current, colorPicker: this.inputColorPickerRef.current}, () => {
			//proceed further
			window.addEventListener("resize", this.resizer, false);
			this.resizer();
		});
	}


	plotDataPoints()
	{
		let ctx = this.state.graphCanvas.getContext("2d");
		ctx.beginPath();
		this.state.yAxis.forEach((v,i) => {
			{
				let xOffset = (parseInt(this.state.xAxis[i] / this.state.xAxisCD) * this.state.graphBoxSize);
				let yOffset = parseInt(v / this.state.yAxisCD)* this.state.graphBoxSize;
				let xDifference = parseInt(this.state.xAxis[i] / this.state.xAxisCD) * this.state.xAxisCD;
				let yDifference =  parseInt(v / this.state.yAxisCD) * this.state.yAxisCD;
				let xAdditional =Math.abs(xDifference - this.state.xAxis[i]) * (this.state.graphBoxSize / this.state.xAxisCD);
				let yAdditional =Math.abs(yDifference - v) * ( this.state.graphBoxSize / this.state.yAxisCD);
				//console.log(xDifference, this.state.xAxis[i], yDifference, v);
				let xOffsetPosition  = this.state.xAxis[i] === xDifference?
					(this.state.graphMargin + xOffset):
					(this.state.graphMargin + xOffset + xAdditional);
				let yOffsetPosition = v === yDifference ?
					(this.state.graphMargin + yOffset) :
					(this.state.graphMargin + yOffset + yAdditional);
				if(yOffsetPosition <= ( this.state.graphCanvas.height - this.state.graphMargin) && xOffsetPosition <=  (this.state.graphCanvas.width - this.state.graphMargin))
				{
					ctx.lineTo(xOffsetPosition, yOffsetPosition);
					//ctx.strokeText(`${this.state.xAxis[i]}, ${v}`, xOffsetPosition, yOffsetPosition);
					ctx.strokeStyle = this.state.graphColor;
					ctx.lineWidth = 1;
					ctx.stroke();
					ctx.moveTo(xOffsetPosition, yOffsetPosition);
					ctx.beginPath();
					ctx.arc( xOffsetPosition, yOffsetPosition, 4, 0, Math.PI*2, true);
					ctx.fillStyle = this.state.pointArcColor;
					ctx.fill();
					ctx.closePath();
				}
			}
		});
		ctx.closePath();
	}

	resizer()
	{
		let graphCanvas = this.state.graphCanvas;
		//console.log(this.props.parentRef.clientWidth);	
/*         if(graphCanvas.width < window.innerWidth || graphCanvas.height < window.innerHeight)
		{
			//expanded screen
			let gBs = this.state.graphBoxSize > 40 ? this.state.graphBoxSize - 5 : this.state.graphBoxSize;
			this.setState({graphBoxSize: gBs});
		}
		else
		{
			//shrinked screen
			let gBs = this.state.graphBoxSize > 0? this.state.graphBoxSize + 5 : this.state.graphBoxSize;
			this.setState({graphBoxSize: gBs});
		} */
		try
		{
			graphCanvas.width = this.props.parentRef.clientWidth -this.state.resizeFactor;
			graphCanvas.height = this.props.parentRef.clientHeight -this.state.resizeFactor;
			this.setState({graphCanvas: graphCanvas}, () => {
				let context = this.state.graphCanvas.getContext("2d");
				context.fillStyle = "slategray";
				context.fillRect(0,0,this.state.graphCanvas.width, this.state.graphCanvas.height);
				this.drawAxes();
				this.plotAxesValues();
				this.plotDataPoints();
				this.drawLegend();
				this.crossHairToggler(this.state.crossHairToggleValue);
				this.graphColorPicker();
			});
		}
		catch(err)
		{
			console.log(err);
		}
	}

	componentWillUnmount()
	{
		window.removeEventListener("resize", this.resizer, false);
	}

	drawAxes()
	{
		let context = this.state.graphCanvas.getContext("2d");
		context.beginPath();
		//yaxis
		context.moveTo(this.state.graphMargin,this.state.graphMargin);
		context.font = "5px serif";
		context.lineTo(this.state.graphMargin, (this.state.graphCanvas.height - this.state.graphMargin));
		//xaxis
		context.moveTo(this.state.graphMargin, (this.state.graphCanvas.height -this.state.graphMargin));
		context.lineTo((this.state.graphCanvas.width - this.state.graphMargin), (this.state.graphCanvas.height - this.state.graphMargin));
		context.strokeStyle = "#000";
		context.lineWidth = 1;
		context.stroke();
		context.closePath();
	}

	drawCrossHair(showCoordandCH)
	{
		if(showCoordandCH)
		{
			var context = this.state.graphCanvas.getContext("2d");
			context.beginPath();
			//x-axis crosshair
			context.moveTo(this.state.mouseX, this.state.graphMargin);
			context.lineTo(this.state.mouseX, (this.state.graphCanvas.height - this.state.graphMargin));
			//y-axis crosshair
			context.moveTo(this.state.graphMargin, this.state.mouseY);
			context.lineTo((this.state.graphCanvas.width - this.state.graphMargin),this.state.mouseY );
			context.lineWidth = 1;
			let xValue = parseInt(((this.state.mouseX - this.state.graphMargin) / this.state.graphBoxSize) *  this.state.xAxisCD);
			let yValue  = parseInt(((this.state.mouseY  - this.state.graphMargin)/ this.state.graphBoxSize) * this.state.yAxisCD);
			this.state.yAxis.forEach((v,i) => {
				if(xValue === this.state.xAxis[i] && yValue === v)
				{
					context.strokeStyle = "#000";
					context.lineWidth = 1;
					context.strokeText(`${xValue}, ${yValue}`, this.state.mouseX, this.state.mouseY);
				}
			});
			context.strokeStyle = "#000";
			//context.strokeText(`${xValue}, ${yValue}`, this.state.mouseX, this.state.mouseY);
			//context.strokeText(`${this.state.mouseX - this.state.graphMargin}, ${this.state.mouseY - this.state.graphMargin}`, this.state.mouseX, this.state.mouseY);
			context.stroke();
			context.closePath();
		}
	}

	getMaxElement(dataset)
	{
		let max = dataset[0];
		dataset.forEach((v) => {
			if(max < v)
			{
				max =v;
			}
		});
		//console.log(max);
		return max;
		
	}

	getMinElement(dataset)
	{
		let min =dataset[0]
		dataset.forEach((v) => {
			if(min > v)
			{
				min =v;
			}
		});
		return min;
	}

	getXAxisCD(dataset)
	{
		//console.log(this.getMaxElement(dataset) , this.getMinElement(dataset))
		return Math.ceil((this.getMaxElement(dataset)/10));
	}

	getYAxisCD(dataset)
	{
		return Math.ceil((this.getMaxElement(dataset))/ 10);
	}

	handleMouseMovement(e)
	{
		let rect = this.state.graphCanvas.getBoundingClientRect();
		this.setState({
			mouseX : e.clientX - rect.left,
			mouseY : e.clientY - rect.top
		}, () => {
			//drawuCrosshair
			this.state.graphCanvas.getContext("2d").clearRect(0, 0, this.state.graphCanvas.width, this.state.graphCanvas.height);
			this.drawAxes();
			this.plotAxesValues();
			//console.log(this.state.mouseX, this.state.mouseY);
			this.plotDataPoints();
			this.drawLegend();
			this.crossHairToggler(this.state.crossHairToggleValue);
			this.graphColorPicker();
			if((this.state.mouseX >= this.state.graphMargin && this.state.mouseY >= this.state.graphMargin) && (this.state.mouseX <= (this.state.graphCanvas.width - this.state.graphMargin) && this.state.mouseY <= (this.state.graphCanvas.height - this.state.graphMargin)))
			{
				this.drawCrossHair(this.props.showCoord === undefined?this.state.crossHairToggleValue: this.props.showCoord);
			}
		});
	}

	drawLegend()
	{
		this.drawLegendPoints();
		let context = this.state.graphCanvas.getContext("2d");
		let x  = this.state.graphCanvas.width - this.state.legendWidth;
		context.beginPath();
		context.rect(x, 0, this.state.legendWidth, this.state.graphMargin);
		context.strokeStyle = "#000";
		context.lineWidth = 3;
		context.stroke();
		context.fillStyle = "#0f0";
		context.fillText("LEGENDS", (x + parseInt(this.state.legendWidth/2)) ,this.state.legendTitleTopMargin);
		context.closePath();
	}

	drawLegendPoints()
	{
		let context = this.state.graphCanvas.getContext("2d");
		context.beginPath();
		let x = (this.state.graphCanvas.width - this.state.legendWidth);
		context.fillRect(x + this.state.legnedPointsBottomMargin,this.state.graphMargin - this.state.legnedPointsBottomMargin,5,5);
		context.fillStyle = this.state.pointArcColor;
		context.fillText("Y-axis", x + (this.state.legnedPointsBottomMargin * 3), this.state.graphMargin - this.state.legnedPointsBottomMargin +5);
		context.fill();
		context.closePath();
		context.beginPath();
		context.fillStyle = this.state.graphColor;
		context.fillRect( this.state.graphCanvas.width -this.state.graphMargin - (this.state.legnedPointsBottomMargin*3),this.state.graphMargin - this.state.legnedPointsBottomMargin,5,5 );
		context.fillText("X-Axis", this.state.graphCanvas.width -this.state.graphMargin - (this.state.legendTitleTopMargin), this.state.graphMargin - this.state.legnedPointsBottomMargin +5);
		context.fill();
		context.closePath();
	}

	crossHairToggler(toggleValue)
	{
		let context = this.state.graphCanvas.getContext("2d");
		context.beginPath();
		context.fillText("Cross-Hair Toggle Value", 0, this.state.legendTitleTopMargin);
		toggleValue? context.fillStyle ="#000":context.fillStyle ="#fff";
		context.arc(context.measureText("Cross-Hair Toggle Value").width + this.state.legendTitleTopMargin, this.state.legendTitleTopMargin, 5, 0, Math.PI *2, false);
		context.fill();
		context.closePath();
	}

	checkToggleClicked(mx,my, arcX, arcY)
	{
		if (Math.pow((mx - arcX), 2) + Math.pow((my -  arcY),2) < 25)
		{
			let chTV = this.state.crossHairToggleValue;
			this.setState({crossHairToggleValue : !chTV}, () => {
				//console.log(this.state.crossHairToggleValue)
			});
		}
	}


	handleClickEvent(e)
	{
		let rect = this.state.graphCanvas.getBoundingClientRect();
		let context = this.state.graphCanvas.getContext("2d");
		let mouseX = e.clientX - rect.left;
		let mouseY = e.clientY - rect.top;
		this.checkToggleClicked(mouseX, mouseY, context.measureText("Cross-Hair Toggle Value").width + this.state.legendTitleTopMargin, this.state.legendTitleTopMargin);
		this.checkColorChangerClicked(mouseX, mouseY, this.state.graphBoxSize *6, this.state.legendTitleTopMargin);
	}


	graphColorPicker()
	{
		let context = this.state.graphCanvas.getContext("2d");
		context.beginPath();
		context.arc(this.state.graphBoxSize*6, this.state.legendTitleTopMargin, 10, 0, Math.PI*2, false);
		context.fillStyle = this.state.graphColor;
		context.fill();
		context.closePath();
	}

	checkColorChangerClicked(mx,my, arcX, arcY)
	{
		if(Math.pow((mx- arcX), 2) + Math.pow((my-arcY) , 2)< 100)
		{
			this.inputColorPickerRef.current.click();
		}
	}

	render()
	{
		return (
			<div>
				<canvas ref={this.canvasRef} onMouseMove = {this.handleMouseMovement} onClick= {this.handleClickEvent}/>
				<input type="color" hidden={true} ref={this.inputColorPickerRef} onChange = {(e) => {
					let color = e.target.value;
					this.setState({graphColor : color});
				}}/>
			</div>
		);
	}
}
export default Canvas;