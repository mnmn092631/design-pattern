abstract class GrimpanPlatform {}
abstract class Grimpan {
  constructor(public readonly platform: GrimpanPlatform) {}
}

class PremiumGrimpan extends Grimpan {}
class BasicGrimpan extends Grimpan {}
class ExpertGrimpan extends Grimpan {}

class ChromeGrimpan extends GrimpanPlatform {}
class IEGGrimpan extends GrimpanPlatform {}
class SafariGrimpan extends GrimpanPlatform {}

new PremiumGrimpan(new ChromeGrimpan());
