function Queue() {
    var data = [];

    this.clear = function() {
        data.length = 0;
    };

    this.getLength = function() {
        return data.length;
    };

    this.isEmpty = function() {
        return data.length === 0;
    };

    this.enqueue = function(item) {
        data.push(item);
    };

    this.dequeue = function() {
        return (data.length === 0 ? undefined : data.shift());
    };

    this.peek = function() {
        return (data.length > 0 ? data[0] : undefined);
    };
}