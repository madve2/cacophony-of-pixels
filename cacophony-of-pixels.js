document.addEventListener("DOMContentLoaded", function () {
    document.removeEventListener("DOMContentLoaded", arguments.callee, false);
    
    // canvas setup
    var can = document.getElementById("screen");
    can.width = window.screen.width;
    can.height = window.screen.height;
    var ctx = can.getContext("2d");
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, can.width, can.height);
    
    // stores for animatable values + a function to generate them
    var startValues = {};
    var endValues = {};
    
    var generateValues = function(valueStore) {
        valueStore.spotlightRadius = (screen.height / 8) + Math.random() * (screen.height / 4);
        valueStore.spotlightX = Math.random() * screen.width;
        valueStore.spotlightY = Math.random() * screen.height;
        valueStore.randomness = Math.random() * 0.7;
        valueStore.redConstant = Math.random();
        valueStore.redConstantRate = Math.random();
        valueStore.greenConstant = Math.random();
        valueStore.greenConstantRate = Math.random();
        valueStore.blueConstant = Math.random();
        valueStore.blueConstantRate = Math.random();
    }
    
    generateValues(endValues); //we'll get the first startValues from here... it's hacky, but hey: less flags!
    
    // animation-related global variables (yummy globals!)
    var currentAnimationState = 0;
    var currentAnimationLengthMs = -1;
    var pastAnimationsMs = 0;
    
    // constans and silly utility methods
    var pixelSize = 10;
    
    var lerp = function (a, b, f) {
        return a * (1 - f) + b * f;
    }
    
    var easeIn = function(f) {
        return Math.pow(f, 2);
    }
    
    var easeInOut = function(f) {
        return (f <= 0.5) ? easeIn(f * 2) / 2 : ((1 - easeIn((1 - f) * 2)) / 2 + 0.5);
    }
    
    var getAnimatedValue = function (propertyName) {
        var f = easeInOut(currentAnimationState);
        // gotta love JavaScript objects
        return lerp(startValues[propertyName], endValues[propertyName], f);
    }
    
    var getLightAmount = function(distFactor, constant, constantRate) {
        return distFactor * (1 - constantRate) + constant * constantRate;
    }
    
    var getBaseNoise = function () {
        return (Math.random() * 255 * getAnimatedValue("randomness")) + 255 * (1 - getAnimatedValue("randomness"));
    }
    
    var simpleCopy = function (from, to) {
      //Thanks, http://stackoverflow.com/questions/9362716/how-to-duplicate-object-properties-in-another-object
      for(var k in from) to[k] = from[k];  
    } 
    
    var redAmountFun = function (d) { return getLightAmount(d, getAnimatedValue("redConstant"), getAnimatedValue("redConstantRate")); };
    var greenAmountFun = function (d) { return getLightAmount(d, getAnimatedValue("greenConstant"), getAnimatedValue("greenConstantRate")); };
    var blueAmountFun = function (d) { return getLightAmount(d, getAnimatedValue("blueConstant"), getAnimatedValue("blueConstantRate")); };

    // "planning" the next animation
    var setupAnimation = function() {
        simpleCopy(endValues, startValues);
        generateValues(endValues);
        currentAnimationLengthMs = 1000 + Math.random() * 3000;
    }

    // the "renderer"... get ready to hear your fans crying
    var start = null;
    var render = function (timestampMs) {
        if (!start) start = timestampMs;
        var elapsedMs = timestampMs - start;
        var animationElapsedMs = elapsedMs - pastAnimationsMs;
        if (animationElapsedMs >= currentAnimationLengthMs) {
            pastAnimationsMs += currentAnimationLengthMs;
            setupAnimation();
            animationElapsedMs = 0;
        }
        
        currentAnimationState = animationElapsedMs / currentAnimationLengthMs;
        
        for (var i = 0; i < can.width; i += pixelSize)
            for (var j = 0; j < can.height; j += pixelSize) {
                var dist = Math.sqrt((getAnimatedValue("spotlightX") - i) * (getAnimatedValue("spotlightX") - i)
                                    + (getAnimatedValue("spotlightY") - j) * (getAnimatedValue("spotlightY") - j))
                var distFactor = Math.max(getAnimatedValue("spotlightRadius") - dist, 0) / dist;
                
                var redAmount = redAmountFun(distFactor);
                var greenAmount = greenAmountFun(distFactor);
                var blueAmount = blueAmountFun(distFactor);
                
                var color = "rgb(" + Math.floor(getBaseNoise() * redAmount)
                                   + ", "
                                   + Math.floor(getBaseNoise() * greenAmount)
                                   + ", "
                                   + Math.floor(getBaseNoise() * blueAmount) + ")";
                ctx.fillStyle = color;
                ctx.fillRect(i, j, pixelSize, pixelSize);
            }
    }
    
    var animate = function(timestamp) {
        requestAnimationFrame(animate);
        render(timestamp);
    }
    
    requestAnimationFrame(animate);
});