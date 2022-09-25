const welcome = {
    message: 'Welcome to the Vehicle API',
    documentation: 'http://localhost:3000/docs',
    routes: [
        {
            route: '/vehicles/:id',
            method: 'GET',
            description: 'Returns a vehicle object  that contains information about a vehicle with the specified ID',
        },
        {
            route: '/vehicles/:id/doors',
            method: 'GET',
            description: 'Returns an object containing information about the locked status of each door',
        },
        {
            route: '/vehicles/:id/fuel',
            method: 'GET',
            description: 'Returns a percentage of fuel remaining in the tank of the vehicle',
        },
        {
            route: '/vehicles/:id/battery',
            method: 'GET',
            description: 'Returns a percentage of battery remaining in the battery of the vehicle',
        },
        {
            route: '/vehicles/:id/engine',
            method: 'POST',
            description: 'Allows you to start or stop the engine of the vehicle',
        },
    ],
};

export default welcome;
