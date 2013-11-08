var app     = require('../../app').app
  , request = require('supertest');

var data = {
    from: 'here',
    to: 'there'
}

describe('/tickets', function () {
    it('respond with json', function (done) {
        request(app)
            .get('/tickets')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
    it('accept json', function (done) {
        request(app)
            .post('/tickets')
            .send(data)
            .expect(201, done);
    });
    it('store json', function (done) {
        request(app)
            .get('/tickets')
            .expect(200)
            .end(function (err, res) {
                if (err) return done(err);

                // only one ticket was created
                expect(res.body.length).toBe(1);
                // the data returned identically
                expect(res.body[0].from).toBe(data.from);
                expect(res.body[0].to).toBe(data.to);

                done();
            });
    });
    it('be deleteable', function (done) {
        request(app)
            .del('/tickets')
            .expect(200, done);
    });
});
