# Generated by Django 3.2.5 on 2022-04-18 01:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('slider', '0011_alter_slider_img'),
    ]

    operations = [
        migrations.AlterField(
            model_name='slider',
            name='img',
            field=models.ImageField(default='imgs/slider/default.jpg', upload_to='imgs/slider'),
        ),
    ]
