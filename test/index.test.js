const authRouter = require("../auth");
const {secured , renew} = require("../index");
const sinon = require('sinon');
const middleware = require('../server');
describe('secured', () => {
    beforeEach(()=> {
        //replace the isLoggedIn function in the middleware module with this fake function
        securedStub = sinon.stub(middleware, 'secured').callsFake((req, res, next) => {next()})
        renewStub = sinon.stub(middleware, 'renew').callsFake((req, res, next) => {next()})
    })
    it('should navigate to login page  if username is missing in request', async () => {
        const req = mockRequest(
            { user:'rathi'}
        );
        const res = mockResponse();
        await secured(req, res,() => {});
        expect(res.redirect).equals("/login");
        expect(req.user).toEqual({
            user: 'rathi',
        });
    });
    // test('should 400 if password is missing from body', async () => {
    //     const req = mockRequest(
    //         {},
    //         { username: 'hugo' }
    //     );
    //     const res = mockResponse();
    //     await login(req, res);
    //     expect(res.status).toHaveBeenCalledWith(400);
    //     expect(res.json).toHaveBeenCalledWith({
    //         message: 'username and password are required'
    //     });
    // });
    // test('should 401 with message if user with passed username does not exist', async () => {
    //     const req = mockRequest(
    //         {},
    //         {
    //             username: 'hugo-boss',
    //             password: 'boss'
    //         }
    //     );
    //     const res = mockResponse();
    //     await login(req, res);
    //     expect(res.status).toHaveBeenCalledWith(401);
    //     expect(res.json).toHaveBeenCalledWith({
    //         message: 'No user with matching username'
    //     });
    // });
    // test('should 401 with message if passed password does not match stored password', async () => {
    //     const req = mockRequest(
    //         {},
    //         {
    //             username: 'guest',
    //             password: 'not-good-password'
    //         }
    //     );
    //     const res = mockResponse();
    //     await login(req, res);
    //     expect(res.status).toHaveBeenCalledWith(401);
    //     expect(res.json).toHaveBeenCalledWith({
    //         message: 'Wrong password'
    //     });
    // });
    // test('should 201 and set session.data with username if user exists and right password provided', async () => {
    //     const req = mockRequest(
    //         {},
    //         {
    //             username: 'guest',
    //             password: 'guest-boss'
    //         }
    //     );
    //     const res = mockResponse();
    //     await login(req, res);
    //     expect(res.status).toHaveBeenCalledWith(201);
    //     expect(res.json).toHaveBeenCalled();
    //     expect(req.session.data).toEqual({
    //         username: 'guest',
    //     });
    // });
});
