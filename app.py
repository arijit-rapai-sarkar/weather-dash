import os
import sys


def main():
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "weather_dashboard.settings")

    if len(sys.argv) == 1:
      host = os.getenv("DJANGO_HOST", "0.0.0.0")
      port = os.getenv("DJANGO_PORT", "8000")
      sys.argv.extend(["runserver", f"{host}:{port}"])

    from django.core.management import execute_from_command_line

    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()
