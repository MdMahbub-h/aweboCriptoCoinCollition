let TestAdManager = new Phaser.Class({
  Extends: Phaser.GameObjects.Container,

  initialize: function TestAdManager(scene) {
    this.scene = game_data["scene"];
    Phaser.GameObjects.Container.call(this, scene, 0, 0);
    this.emitter = new Phaser.Events.EventEmitter();
    this.create_assets();
  },

  create_assets() {
    this.default_overlay = new Phaser.GameObjects.Image(
      this.scene,
      0,
      0,
      "dark_overlay"
    );
    this.default_overlay.setOrigin(0, 0);
    this.default_overlay.alpha = 1;
    this.add(this.default_overlay);
    this.default_overlay.setInteractive();

    this.value_txt = new Phaser.GameObjects.Text(
      this.scene,
      loading_vars["W"] / 2,
      loading_vars["H"] / 2,
      "5",
      { fontFamily: "font2", fontSize: 90, color: "#fff" }
    );
    this.value_txt.setOrigin(0.5);
    this.add(this.value_txt);

    this.desc_txt = new Phaser.GameObjects.Text(
      this.scene,
      loading_vars["W"] / 2,
      this.value_txt.y + 70,
      "Test desc",
      { fontFamily: "font2", fontSize: 45, color: "#fff" }
    );
    this.desc_txt.setOrigin(0.5);
    this.add(this.desc_txt);
    this.setVisible(false);
  },

  call_ad(params, on_complete = () => {}) {
    this.setVisible(true);

    if (typeof admob !== "undefined") {
      // **AdMob for Android/iOS WebView**
      admob.rewardedAd
        .load({
          adUnitId: "ca-app-pub-2100172391789867/6269596151",
        })
        .then(() => admob.rewardedAd.show())
        .then(() => {
          console.log("Ad Finished");
          on_complete();
        })
        .catch((err) => {
          console.error("AdMob Error: ", err);
          this.show_amp_ad(on_complete);
        });
    } else {
      console.warn("AdMob is not available. Running AMP ad.");
      this.show_amp_ad(on_complete);
    }
  },

  show_amp_ad(on_complete) {
    // Remove any existing ad before adding a new one
    let existingAd = document.getElementById("amp-ad-container");
    if (existingAd) existingAd.remove();

    // **Create AMP ad container**
    let adContainer = document.createElement("div");
    adContainer.id = "amp-ad-container";
    adContainer.style.position = "absolute";
    adContainer.style.width = "100vw";
    adContainer.style.height = "320px";
    adContainer.style.top = "50%";
    adContainer.style.left = "50%";
    adContainer.style.transform = "translate(-50%, -50%)";
    adContainer.style.backgroundColor = "#fff";

    // **Create AMP ad element**
    let ampAd = document.createElement("amp-ad");
    ampAd.setAttribute("width", "100vw");
    ampAd.setAttribute("height", "320");
    ampAd.setAttribute("type", "adsense");
    ampAd.setAttribute("data-ad-client", "ca-pub-2100172391789867");
    ampAd.setAttribute("data-ad-slot", "8177342683");
    ampAd.setAttribute("data-auto-format", "rspv");
    ampAd.setAttribute("data-full-width", "");

    let overflowDiv = document.createElement("div");
    overflowDiv.setAttribute("overflow", "");

    ampAd.appendChild(overflowDiv);
    adContainer.appendChild(ampAd);
    document.body.appendChild(adContainer);

    let obj = { val: 5 };
    this.value_txt.setText(obj.val);

    this.scene.tweens.add({
      targets: obj,
      val: 0,
      duration: obj.val * 1000,
      onUpdate: () => {
        this.value_txt.setText(Math.ceil(obj.val));
      },
      onComplete: () => {
        this.setVisible(false);
        if (document.getElementById("amp-ad-container")) {
          document.getElementById("amp-ad-container").remove();
        }
        on_complete();
      },
    });
  },
});
