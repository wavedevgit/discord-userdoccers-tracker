[ -d "discord-userdoccers" ] && rm -rf "discord-userdoccers"
git clone https://github.com/discord-userdoccers/discord-userdoccers.git
# merge all mdx files that probably have routes
out="./data/merged.mdx"
> "$out"

for f in discord-userdoccers/pages/*/*.mdx; do
  [ -f "$f" ] || continue
  echo "----- $f -----" >> "$out"
  cat "$f" >> "$out"
  echo -e "\n" >> "$out"
done

# use nodejs to grab routes info
node get_routes.js
node check.js

rm -rf discord-userdoccers