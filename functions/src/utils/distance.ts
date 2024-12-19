export function haversineDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    lat1 = degreesToRadians(lat1);
    lon1 = degreesToRadians(lon1);
    lat2 = degreesToRadians(lat2);
    lon2 = degreesToRadians(lon2);
  
    const RADIO_TIERRA_EN_KILOMETROS = 6371;
    const diferenciaEntreLongitudes = lon2 - lon1;
    const diferenciaEntreLatitudes = lat2 - lat1;
    const a =
      Math.pow(Math.sin(diferenciaEntreLatitudes / 2.0), 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.pow(Math.sin(diferenciaEntreLongitudes / 2.0), 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return RADIO_TIERRA_EN_KILOMETROS * c;
  }
  
  /**
   * Converts degrees to radians.
   *
   * @param {number} degrees - The angle in degrees.
   * @return {number} The angle in radians.
   */
  function degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }