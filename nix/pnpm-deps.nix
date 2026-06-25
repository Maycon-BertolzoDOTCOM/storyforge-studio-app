{
  # Vendored pnpm store hashes for the workspace packages built by the flake.
  # Generated lock artifact; do not hand-edit outside intentional Nix maintenance.
  #
  # The daemon and web derivations now build from different filtered source
  # trees, so each fetchPnpmDeps invocation needs its own fixed-output hash.
  # Refresh a hash whenever pnpm-lock.yaml or that derivation's source filter
  # changes:
  # 1. Temporarily set the consuming `hash = lib.fakeHash;`
  # 2. Run the relevant nix build/flake check
  # 3. Copy the expected hash printed by Nix into the matching field below
<<<<<<< HEAD
  daemonHash = "sha256-QR49Ld0IP/3r89UIR+uzrTVYcvycQAYPXcBwzYWTfNE=";
  webHash = "sha256-Y9hspnCl3NGO7yTIIfqu2yBN0hYvfLEjiWRKxjasGmg=";
=======
  daemonHash = "sha256-ucVnjvGC3BbcZRFakkky9gzoBPieEGRe79vx9uAggnM=";
  webHash = "sha256-b7bG0AW2m2oDIil4cnnr7xns0X1qxtSeOXS77Ks8m8s=";
>>>>>>> 29b138f7a (feat(brands): turn any brand into a reusable design system (#4691))
}
