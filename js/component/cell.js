import {BaseComponent} from "./baseComponent.js";


export class Cell extends BaseComponent {
    constructor(xAxis, yAxis, styles) {
        super(styles);
        this.cell = document.createElement('input');

        this.xAxis = xAxis;
        this.yAxis = yAxis;

        this.value = '';
        this.formula = '';
        this.hasUsedFormula = false;

        this.dependentCells = [];

        this.positionChangeEvent = new CustomEvent('cellChangedPosition', {
            detail: {
                xAxis: this.xAxis,
                yAxis: this.yAxis
            }
        });

        this.addEventListeners();
    }

    serialize = () => {
        return {
            xAxis: this.xAxis,
            yAxis: this.yAxis,

            value: this.value,
            formula: this.formula,

            styles: this.styles
        };
    }

    setValue = (value) => {
        this.value = value;

        if (!this.hasUsedFormula) this.formula = '';
        this.hasUsedFormula = false;
    }

    setFormula = (formula) => {
        this.formula = formula;
        this.hasUsedFormula = true;
    }

    addDependentCell = (cell) => {
        if (!this.dependentCellExists(cell)) {
            this.dependentCells.push(cell)
        }
    };

    dependentCellExists = (cell) => {
        for (let i = 0; i < this.dependentCells.length; i++) {
            if (JSON.stringify(this.dependentCells[i]) === JSON.stringify(cell)) {
                return true;
            }
        }

        return false;
    }

    compileStyles = () => {
        Object.keys(this.styles).forEach(style => {
            this.cell.style[style] = this.styles[style];
        });
    }

    setDefaultStyles = () => {
        this.addStyles({
            ...{
                minHeight: '20px',
                width: '300px',
                fontSize: '16px'
            },
            ...this.styles
        });
    }

    classifyAsTextOrNot = (e) => {
        const currentValueAsNumber = Number(e.target.value);

        if (currentValueAsNumber) {
            this.addStyles({textAlign: 'right'});
            this.setValue(currentValueAsNumber);
        } else {
            this.setValue(e.target.value);
            this.addStyles({textAlign: 'left'});
        }

        this.compileStyles();
    }

    addEventListeners = () => {
        this.cell.addEventListener('lastCellUpdated', this.classifyAsTextOrNot);
        this.cell.addEventListener('change', this.classifyAsTextOrNot);

        this.cell.addEventListener('focus', () => document.dispatchEvent(this.positionChangeEvent));
    }

    render = () => {
        this.setDefaultStyles();

        this.cell.id = this.xAxis + this.yAxis;
        this.cell.classList.add('cell');
        this.compileStyles();
    }
}

export const createCellFromJson = (data) => {
    const cell = new Cell(data.xAxis, data.yAxis, data.styles);
    cell.value = data.value;
    cell.formula = data.formula;
    return cell;
}
