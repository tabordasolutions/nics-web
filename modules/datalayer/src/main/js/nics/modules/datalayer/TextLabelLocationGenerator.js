define({

	return Ext.define('modules.datalayer.textLabelLocationGenerator', {
		var hashCode: function(str) {
			var hash = 0, i, str;
			if(str.length == 0)
				return hash;
			for(i=0;i<str.length; i++) {
				hash = ((hash << 5) - hash) + str.charCodeAt(i);
				hash |= 0;
			}
			return hash;
		},

		var randomTextLabelOffset = function(labelText) {
			var labelOffsetArray = [[0, -15, 'left'], [0, -15, 'right'], [15, 0, 'left'], [0, 15, 'center'], [-10, 0, 'right']];
			var offsetIndex = Math.abs(this.hashCode(labelText)) % labelOffsetArray.length;
			var offset = labelOffsetArray[offsetIndex];
			return offset;
		}
		});
});