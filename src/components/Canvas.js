import React, {Component} from 'react';
class Canvas extends Component
{
    constructor(props)
    {
        super(props);
        this.state ={
            xAxisMean: 0,
            yAxisMean :0,
            graphCanvas : null,
            graphMargin: 40,
            mouseX:0,
            mouseY:0,
            graphPointsMargin:30,
            rangeOfPoints: 20,
            xgraphBoxSize:30,
            yGraphBoxSize:30,
            resizeFactor:5
        };
        this.canvasRef = React.createRef();
        this.getXAxisMean = this.getXAxisMean.bind(this);
        this.getYAxisMean = this.getYAxisMean.bind(this);
        this.drawCrossHair = this.drawCrossHair.bind(this);
        this.drawAxes = this.drawAxes.bind(this);
        this.handleMouseMovement = this.handleMouseMovement.bind(this);
        this.resizer = this.resizer.bind(this);
        this.plotAxesValues = this.plotAxesValues.bind(this);
        this.plotDataPoints = this.plotDataPoints.bind(this);
    }
    componentWillMount()
    {
        //draw the cooridinates based on the data set
        if(this.props.xAxis !== undefined && this.props.yAxis !== undefined)
        {
            let xmean = this.getXAxisMean(this.props.xAxis);
            let ymean = this.getYAxisMean(this.props.yAxis);
            this.setState({xAxisMean :  xmean ,
                yAxisMean : ymean
            });
        }
    }

    plotAxesValues()
    {
        let context = this.state.graphCanvas.getContext("2d");
        //xaxis
        context.beginPath();
        context.moveTo(this.state.graphMargin, this.state.graphMargin);
        context.font = "14px serif";
        for(var i= this.state.graphMargin; i<= (this.state.graphCanvas.width - this.state.graphMargin); i += this.state.xgraphBoxSize)
        {
            context.strokeText(`${parseInt((i - this.state.graphMargin) / this.state.xgraphBoxSize)}`, i, (this.state.graphCanvas.height - this.state.graphMargin)+this.state.graphPointsMargin);
        }
        context.closePath();
        //yAxis
        context.beginPath();
        context.moveTo(this.state.graphMargin, this.state.graphMargin);
        context.font ="14px serif";
        /* for(i = (this.state.graphCanvas.height - this.state.graphMargin); i>= this.state.graphMargin; i-= this.state.yAxisMean)
        {
            context.strokeText(`${parseInt(i + this.state.graphMargin)}`, this.state.graphMargin, this.state.graphCanvas.height - i);
        } */
        for(i=this.state.graphMargin;i<= (this.state.graphCanvas.height - this.state.graphMargin);i+= this.state.yGraphBoxSize)
        {
            context.strokeText(`${parseInt((i -  this.state.graphMargin)/this.state.yGraphBoxSize)}`, this.state.graphMargin - this.state.graphPointsMargin, i);
        }
        context.closePath();
    }

    componentDidMount()
    {
        this.setState({graphCanvas : this.canvasRef.current}, () => {
            //proceed further
            window.addEventListener("resize", this.resizer, false);
            this.resizer();
            if(this.props.xAxis !== undefined)
            {
                let xgraphBoxSize = Math.round(this.state.graphCanvas.width / this.props.xAxis.length);
                let yGraphBoxSize = Math.round(this.state.graphCanvas.height / this.props.xAxis.length);
                this.setState({
                    xgraphBoxSize: xgraphBoxSize,
                    yGraphBoxSize : yGraphBoxSize
                });
            }
            this.plotAxesValues();
            this.plotDataPoints();
        });
    }


    plotDataPoints()
    {
        let ctx = this.state.graphCanvas.getContext("2d");
        ctx.beginPath();
        this.props.yAxis.forEach((v,i) => {


            if(
                (Math.round(this.state.graphCanvas.width / this.state.xgraphBoxSize) - this.state.resizeFactor > this.props.xAxis[i])
                &&
                (Math.round(this.state.graphCanvas.height / this.state.yGraphBoxSize) - this.state.resizeFactor > v)
            )
            {
                ctx.lineTo((this.state.graphMargin + (this.props.xAxis[i]* this.state.xgraphBoxSize)), (this.state.graphMargin + (v* this.state.yGraphBoxSize)));
                ctx.strokeText(`${this.props.xAxis[i]}, ${v}`,(this.state.graphMargin + (this.props.xAxis[i]* this.state.xgraphBoxSize)), (this.state.graphMargin + (v* this.state.yGraphBoxSize)));
                ctx.moveTo((this.state.graphMargin + (this.props.xAxis[i]* this.state.xgraphBoxSize)), (this.state.graphMargin + (v* this.state.yGraphBoxSize)));
            }
        });
        ctx.strokeStyle = this.props.graphColor !== undefined? this.props.graphColor : "#000";
        ctx.stroke();
        ctx.closePath();
    }

    resizer()
    {
        let graphCanvas = this.state.graphCanvas;
        graphCanvas.width = window.innerWidth -this.state.resizeFactor;
        graphCanvas.height = window.innerHeight -this.state.resizeFactor;
        this.setState({graphCanvas: graphCanvas}, () => {
            let context = this.state.graphCanvas.getContext("2d");
            context.fillStyle = "slategray";
            context.fillRect(0,0,this.state.graphCanvas.width, this.state.graphCanvas.height);
            this.drawAxes();
            this.plotAxesValues();
            this.plotDataPoints();
        });
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
        context.strokeStyle = "#000 solid";
        context.stroke();
        context.closePath();
    }

    drawCrossHair()
    {
        var context = this.state.graphCanvas.getContext("2d");
        context.beginPath();
        //x-axis crosshair
        context.moveTo(this.state.mouseX, this.state.graphMargin);
        context.lineTo(this.state.mouseX, (this.state.graphCanvas.height - this.state.graphMargin));
        //y-axis crosshair
        context.moveTo(this.state.graphMargin, this.state.mouseY);
        context.lineTo((this.state.graphCanvas.width - this.state.graphMargin),this.state.mouseY );
        context.stroke();
        context.closePath();
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

    getXAxisMean(dataset)
    {
        //console.log(this.getMaxElement(dataset) , this.getMinElement(dataset))
        return Math.ceil((this.getMaxElement(dataset)/10));
    }

    getYAxisMean(dataset)
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
            if((this.state.mouseX >= this.state.graphMargin && this.state.mouseY >= this.state.graphMargin) && (this.state.mouseX <= (this.state.graphCanvas.width - this.state.graphMargin) && this.state.mouseY <= (this.state.graphCanvas.height - this.state.graphMargin)))this.drawCrossHair();
        });
    }

    render()
    {
        return (
            <canvas ref={this.canvasRef} onMouseMove = {this.handleMouseMovement}/>
        );
    }
}
export default Canvas;