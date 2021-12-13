# Pure Javascript Carousel

Get 'mouse move speed' via 'mouse down-event' (using timestamp, x-position)

1. define Maximum and Minimum Range of carousel container
2. get mouse move speed and define TYPE of mouse move.  
   2-1. STAY : no change detected.  
   2-2. LEFT : mouse speed over 0.2, detect positive x-position.  
   2-3. RIGHT : mouse speed over 0.2, detect negative x-position.  
   2-4. RETURN_TO_LEFT : mouse speed under 0.2, detect positive x-position.  
   2-5. RETURN_TO_RIGHT : mouse speed under 0.2, detect negative x-position.

3. content move after define TYPE of mouse event. for softly event i use tansition property.

[Demo](https://codepen.io/pen/?template=mopPPy)
