var calendarController = function (){
    var self = this;

    self.getDogById = function (dogs, dogId, callback){
        var dog;

        if(dogId === 'all') {
            dog = {
                _id : dogId,
                name : 'All animals'
            }
        } else {
            dog = dogs.find(function(dog){
                if(dog._id === dogId) {
                    return dog;
                }
            });
        }

        callback(dog);
    };
};

module.exports = calendarController;