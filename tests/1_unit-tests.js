const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

suite('UnitTests', () => {
    suite('Testing Validate method', ()=>{
        test('With empty string => false', ()=>{            
            assert.equal(solver.validate(''), "Expected puzzle to be 81 characters long");

        });

        test('Logic handles a valid puzzle string of 81 characters', ()=>{            
            assert.equal(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), true);
        })

        test('Logic handles a puzzle string that is not 81 characters in length', () => {
            assert.equal(solver.validate('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37..'), "Expected puzzle to be 81 characters long");            
        })

        test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', ()=>{
            assert.equal(solver.validate('1.5..2.84..B3.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), "Invalid characters in puzzle");
        });
    });

    suite('Testing the getIndex method', ()=>{
        test('Getting index using row, col', ()=>{
            assert.equal(solver.getIndex(0, 0), 0);
            assert.equal(solver.getIndex(0, 1), 1);
            assert.equal(solver.getIndex(0, 8), 8);
            assert.equal(solver.getIndex(1, 0), 9);
            assert.equal(solver.getIndex(1, 1), 10);
            assert.equal(solver.getIndex(8, 8), 80);

        })
    })

    suite('Testing row placement method', ()=>{
        test('Logic handles a valid row placement', ()=>{
            assert.equal(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                0, 1, 3), true);
            
            assert.equal(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 
                8, 8, 8), true);
        })

        test('Logic handles an invalid row placement', ()=>{
            assert.equal(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 
                0, 1, 2), false);
            assert.equal(solver.checkRowPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                8, 8, 1), false);            
        })
    });

    suite('Testing column placement method', ()=>{
        test('Logic handles a valid column placement', ()=>{
            assert.equal(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                1, 0, 9), true);
            assert.equal(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                2, 2, 8), true);
        })
        test('Logic handles an invalid column placement', ()=>{
            assert.equal(solver.checkColPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                4, 0, 1), false);
        })
    });

    suite('Testing region placement method', ()=>{
        test('Logic handles a valid region (3x3 grid) placement', ()=>{
            assert.equal(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 
                1, 0, 9), true);
            assert.equal(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                2, 2, 8), true);
        })

        test('Logic handles an invalid region (3x3 grid) placement', ()=>{
            assert.equal(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 
                1, 1, 5), false);
            
            assert.equal(solver.checkRegionPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 
                3, 7, 7), false);
        })
    });
    

    suite('Testing the solve method', ()=>{
        test('Valid puzzle strings pass the solver', ()=>{
            assert.equal(solver.solve('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'), 
                '135762984946381257728459613694517832812936745357824196473298561581673429269145378');           
        })

        test('Solvable string 2 => String', () => {

            assert.equal(solver.solve('5..91372.3...8.5.9.9.25..8.68.47.23...95..46.7.4.....5.2.......4..8916..85.72...3'),
                '568913724342687519197254386685479231219538467734162895926345178473891652851726943');
         
        })
        test('Solvable string 3 => String', () => {
         
            assert.equal(solver.solve('..839.7.575.....964..1.......16.29846.9.312.7..754.....62..5.78.8...3.2...492...1'),
                '218396745753284196496157832531672984649831257827549613962415378185763429374928561');
         
        })
        test('Solvable string 4 => String', () => {
         
            assert.equal(solver.solve('.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6'),
                '473891265851726394926345817568913472342687951197254638734162589685479123219538746');
          
        })
        test('Solver returns the expected solution for an incomplete puzzle', () => {
          
            assert.equal(solver.solve('82754..6...16..89...98315.749.157.............53..4...96.415..81..7632..3...28.51'),
                '827549163531672894649831527496157382218396475753284916962415738185763249374928651');
        })

        test('Invalid puzzle strings fail the solver', ()=>{
            assert.equal(solver.solve('..9..5.1.85.4....2432......1...69.83.9.....6.62.71...8......1945....4.37.4.3..6..'), false);
        })

        
    })

    suite('Testing validate coordinate method', ()=>{
        test('Sending valid coordinates => true', ()=>{
            assert.equal(solver.validateCordinate('A1'), true);
            assert.equal(solver.validateCordinate('B1'), true);
            assert.equal(solver.validateCordinate('C6'), true);
            assert.equal(solver.validateCordinate('I8'), true);
            assert.equal(solver.validateCordinate('F7'), true);
        });

        test('Sending invalid coordinates => false', ()=>{
            assert.equal(solver.validateCordinate('Z8'), false);
            assert.equal(solver.validateCordinate('T18'), false);
            assert.equal(solver.validateCordinate('W2'), false);
            assert.equal(solver.validateCordinate('C0'), false);
            assert.equal(solver.validateCordinate('P8'), false);
        })
    })

    suite('Testing convert coordinate method', ()=>{
        test('testing for various values => true', ()=>{
            assert.deepEqual(solver.convertCoordinate('A1'), {row: 0, col: 0});
            assert.deepEqual(solver.convertCoordinate('B1'), { row: 1, col: 0 });
            assert.deepEqual(solver.convertCoordinate('D3'), { row: 3, col: 2 });
            assert.deepEqual(solver.convertCoordinate('I1'), { row: 8, col: 0 });
            assert.deepEqual(solver.convertCoordinate('H5'), { row: 7, col: 4 });
        })
    })

    suite('Testing checkAllPlacement method', ()=>{
        test('When placement is possible', ()=>{
            assert.deepEqual(solver.checkAllPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.', 
                'A2', 3), {valid: true});
            assert.deepEqual(solver.checkAllPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                'I9', 8), { valid: true });
        });

        test('When placement is not possible', ()=>{
            assert.deepEqual(solver.checkAllPlacement('1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                'A2', 1), { valid: false , conflict: ['row', 'region']});
        })
    })
});
