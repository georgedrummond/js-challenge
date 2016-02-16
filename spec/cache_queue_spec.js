describe("A cacheQueue", function() {
  describe("saveRecord()", function(){
    var record = { name: "George" };

    beforeEach(function(){
      cacheQueue.results = [];
      cacheQueue.successRate = 0.7;
    })

    it("adds record to queue", function() {
      cacheQueue.saveRecord(record);
      expect(cacheQueue.results.length).toBe(1);
    });

    it("marks record as unsaved when offline", function(){
      cacheQueue.offline = true;
      cacheQueue.saveRecord(record);

      expect(cacheQueue.results[0].saved).toBe(false);
    });

    it("marks record as saved when online and good network", function(){
      cacheQueue.offline = false;
      cacheQueue.successRate = 1;
      cacheQueue.saveRecord(record);

      expect(cacheQueue.results[0].saved).toBe(true);
    });

    it("marks record as unsaved when online and bad network", function(){
      cacheQueue.offline = false;
      cacheQueue.successRate = 0;
      cacheQueue.saveRecord(record);

      expect(cacheQueue.results[0].saved).toBe(false);
    });
  });

  describe("toggleOffline()", function(){
    it("changes false to true", function(){
      cacheQueue.offline = false;
      cacheQueue.toggleOffline();

      expect(cacheQueue.offline).toBe(true);
    });

    it("changes true to false", function(){
      cacheQueue.offline = true;
      cacheQueue.toggleOffline();

      expect(cacheQueue.offline).toBe(false);
    });
  });

  describe("processQueue()", function(){
    beforeEach(function(){
      cacheQueue.successRate = 1;
      cacheQueue.results = [
        { saved: false, name: 'George' },
        { saved: true,  name: 'Drummond' }
      ];
    });

    it("calls saveRecord on unsaved when online", function(){
      cacheQueue.offline = false;
      cacheQueue.processQueue();

      expect(cacheQueue.results[0].saved).toBe(true);
      expect(cacheQueue.results[1].saved).toBe(true);
    });

    it("doesn't call saveRecord when offline", function(){
      cacheQueue.offline = true;
      cacheQueue.processQueue();

      expect(cacheQueue.results[0].saved).toBe(false);
      expect(cacheQueue.results[1].saved).toBe(true);
    });
  });
});
