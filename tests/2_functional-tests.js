const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    suite('Testing /api/solve endpoint', ()=>{
        test('Solve a puzzle with valid puzzle string 1', (done)=>{
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'})
                .end((err, res)=>{
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'solution');
                    assert.equal(res.body.solution, '135762984946381257728459613694517832812936745357824196473298561581673429269145378');
                    done();
                });           

        })

        test('Solve a puzzle with valid puzzle string 2', (done) => {            

            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'solution');
                    assert.equal(res.body.solution, '473891265851726394926345817568913472342687951197254638734162589685479123219538746');
                    done();
                });

        })

        test('Solve a puzzle with missing puzzle string', (done)=>{
            chai.request(server)
                .post('/api/solve')                
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.deepEqual(res.body, { error: 'Required field missing' });
                    done();
                });
        })

        test('Solve a puzzle with invalid characters', (done)=>{
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2sd.387.6' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Invalid characters in puzzle' });
                    done();
                });
        })

        test('Solve a puzzle with incorrect length', (done)=>{
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '.7.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..ds47.1..2sd.387.6' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Expected puzzle to be 81 characters long' });
                    done();
                });
        });

        test('Solve a puzzle that cannot be solved', (done)=>{
            chai.request(server)
                .post('/api/solve')
                .send({ puzzle: '77.89.....5....3.4.2..4..1.5689..472...6.....1.7.5.63873.1.2.8.6..47.1..2.9.387.6' })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.deepEqual(res.body, { error: 'Puzzle cannot be solved' });
                    done();
                });
        });

    });

    suite('Testing /api/solve endpoint', ()=>{
        test('Check a puzzle placement with all fields 1', (done)=>{
            chai.request(server)
            .post('/api/check/')
            .send({
                puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                coordinate: 'A2',
                value: 3,
            })
            .end((err, res)=>{
                assert.equal(res.status, 200);
                assert.property(res.body, 'valid');
                assert.equal(res.body.valid, true);
                done();
            })
        });

        test('Check a puzzle placement with all fields 2', (done) => {
            chai.request(server)
                .post('/api/check/')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'B2',
                    value: 4,
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.equal(res.body.valid, true);
                    done();
                })
        });

        test('Check a puzzle placement with single placement conflict', (done)=>{
            chai.request(server)
                .post('/api/check/')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'A2',
                    value: 8,
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.equal(res.body.valid, false);
                    assert.property(res.body, 'conflict');
                    assert.isArray(res.body.conflict);
                    assert.equal(res.body.conflict.length, 1);
                    done();
                })
        });

        test('Check a puzzle placement with multiple placement conflicts', (done)=>{
            chai.request(server)
                .post('/api/check/')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'B2',
                    value: 7,
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.equal(res.body.valid, false);
                    assert.property(res.body, 'conflict');
                    assert.isArray(res.body.conflict);
                    assert.equal(res.body.conflict.length, 2);
                    done();
                })
        });

        test('Check a puzzle placement with all placement conflicts', (done)=>{
            chai.request(server)
                .post('/api/check/')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    coordinate: 'A5',
                    value: 1,
                })
                .end((err, res) => {
                    assert.equal(res.status, 200);
                    assert.property(res.body, 'valid');
                    assert.equal(res.body.valid, false);
                    assert.property(res.body, 'conflict');
                    assert.isArray(res.body.conflict);
                    assert.equal(res.body.conflict.length, 3);
                    done();
                });
        });

        test('Check a puzzle placement with missing required fields', (done)=>{
            chai.request(server)
                .post('/api/check/')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',                    
                    value: 1,
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.property(res.body, 'error');
                    assert.deepEqual(res.body, { error: "Required field(s) missing" });
                    done();
                });
        });

        test('Check a puzzle placement with invalid characters', (done)=>{
            chai.request(server)
                .post('/api/check/')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....A.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    value: 1,
                    coordinate: 'A5',
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.property(res.body, 'error');
                    assert.deepEqual(res.body, { error: "Invalid characters in puzzle"});
                    done();
                });
        });

        test('Check a puzzle placement with incorrect length', (done)=>{
            chai.request(server)
                .post('/api/check/')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....A.sds2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    value: 1,
                    coordinate: 'A5',
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.property(res.body, 'error');
                    assert.deepEqual(res.body, { error: "Expected puzzle to be 81 characters long" });
                    done();
                });
        });

        test('Check a puzzle placement with invalid placement coordinate', (done)=>{
            chai.request(server)
                .post('/api/check/')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    value: 1,
                    coordinate: 'Z5',
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.property(res.body, 'error');
                    assert.deepEqual(res.body, { error: "Invalid coordinate" });
                    done();
                });
        });

        test('Check a puzzle placement with invalid placement value', (done)=>{
            chai.request(server)
                .post('/api/check/')
                .send({
                    puzzle: '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.',
                    value: 97,
                    coordinate: 'A5',
                })
                .end((err, res) => {
                    assert.equal(res.status, 400);
                    assert.property(res.body, 'error');
                    assert.deepEqual(res.body, { error: "Invalid value" });
                    done();
                });
        })
    })
});

