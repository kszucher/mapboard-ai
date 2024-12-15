export const getMapX = (e: any) => e.pageX - window.innerWidth + document.getElementById('mainMapDiv')!.scrollLeft;
export const getMapY = (e: any) => e.pageY - window.innerHeight + document.getElementById('mainMapDiv')!.scrollTop;
