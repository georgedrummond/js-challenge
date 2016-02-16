cacheQueue = {
  successRate: 0.7,
  results: [],
  offline: false,

  saveRecord: function(record) {
    if(this.offline || Math.random() >= this.successRate) {
      this._failure(record);
      return false;
    } else {
      this._success(record);
      return true;
    }
  },

  toggleOffline: function() {
    this.offline = !this.offline;
    var $status = $('#status');

    if(this.offline) {
      $status.addClass('label-danger').removeClass('label-success').text('Offline');
    } else {
      $status.removeClass('label-danger').addClass('label-success').text('Online');
    }
  },

  updateRecordCount: function(){
    var recordCount = this._recordStateCount();

    $('#saved-count').text(recordCount.saved || '0');
    $('#queued-count').text(recordCount.queued || '0');
  },

  processQueue: function() {
    if(!this.offline) {
      var queued = _.where(this.results, {saved: false});
      var saved  = _.where(this.results, {saved: true});

      this.results = saved;

      _.each(queued, function(record){
        cacheQueue.saveRecord(record.record);
      });
    }
  },

  _failure: function(record) {
    this.results.push({saved: false, record: record, at: Date()});
  },

  _success: function(record) {
    this.results.push({saved: true, record: record, at: Date()});
  },

  _recordStateCount: function() {
    return _.countBy(this.results, function(record) {
      return record.saved ? 'saved' : 'queued';
    });
  }
}
