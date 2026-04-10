IRB.conf[:COMPLETOR] = :type

require 'irb/completion'
require 'amazing_print'

AmazingPrint.defaults = {
  sort_keys: true,
  index: false,
  indent: -2
}

AmazingPrint.irb!
AmazingPrint.rdbg!

if defined? Rails
  time = Rainbow("(#{Time.now.utc.strftime('%H:%M')} UTC)").yellow

  env_name = if ENV['DEPLOY_ENV'].blank?
    Rainbow(' local ').bg(:green).white
  else
    bg = ENV['DEPLOY_ENV'] == 'production' ? :red : :blue
    Rainbow(" #{ENV['DEPLOY_ENV'].upcase} ").bg(bg).white
  end

  # Build a custom prompt
  IRB.conf[:PROMPT][:ALGOLIA] = IRB.conf[:PROMPT][:CLASSIC].merge(
    PROMPT_I: "#{time} #{env_name} #{IRB.conf[:PROMPT][:CLASSIC][:PROMPT_I]}",
    PROMPT_N: "#{time} #{env_name} #{IRB.conf[:PROMPT][:CLASSIC][:PROMPT_N]}",
    PROMPT_S: "#{time} #{env_name} #{IRB.conf[:PROMPT][:CLASSIC][:PROMPT_S]}",
    PROMPT_C: "#{time} #{env_name} #{IRB.conf[:PROMPT][:CLASSIC][:PROMPT_C]}"
  )

  # Use custom prompt by default
  IRB.conf[:PROMPT_MODE] = :ALGOLIA

end
